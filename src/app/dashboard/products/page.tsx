"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";
import imageCompression from "browser-image-compression";

// TYPES
type Category = {
  id: string;
  name: string;
  position: number;
};

type Product = {
  id: string;
  name: string;
  price: number;
  category_id: string;
  image_url?: string | null;
  description?: string | null;
  position: number;
};

type Group = {
  id: string;
  name: string;
};

// DRAG ITEM
function SortableItem({ id, children }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

export default function ProductsPage() {
  const { user } = useAuth();

  const sensors = useSensors(useSensor(PointerSensor));

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  // FORM (mantido)
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  // MODAIS
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const [showGroupModal, setShowGroupModal] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [user]);

  async function fetchAll() {
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    const tenantId = profile?.tenant_id;

    const { data: cat } = await supabase
      .from("categories")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("position");

    const { data: prod } = await supabase
      .from("products")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("position");

    const { data: grp } = await supabase
      .from("product_groups")
      .select("id, name")
      .eq("tenant_id", tenantId);

    setCategories(cat || []);
    setProducts(prod || []);
    setGroups(grp || []);
  }

  // CATEGORY CREATE
  async function createCategory() {
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    await supabase.from("categories").insert({
      name: categoryName,
      tenant_id: profile?.tenant_id,
    });

    setCategoryName("");
    setShowCategoryModal(false);
    fetchAll();
  }

  // DRAG CATEGORY
  async function handleCategoryDragEnd(event: any) {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);

      const newItems = arrayMove(categories, oldIndex, newIndex);
      setCategories(newItems);

      newItems.forEach(async (cat, index) => {
        await supabase
          .from("categories")
          .update({ position: index })
          .eq("id", cat.id);
      });
    }
  }

  // DRAG PRODUCT
  async function handleProductDragEnd(event: any, categoryId: string) {
    const { active, over } = event;
    if (!over) return;

    const filtered = products.filter((p) => p.category_id === categoryId);

    const oldIndex = filtered.findIndex((p) => p.id === active.id);
    const newIndex = filtered.findIndex((p) => p.id === over.id);

    const newItems = arrayMove(filtered, oldIndex, newIndex);

    newItems.forEach(async (prod, index) => {
      await supabase
        .from("products")
        .update({ position: index })
        .eq("id", prod.id);
    });

    fetchAll();
  }

  // SUBMIT (SEU ORIGINAL MELHORADO)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    let image_url = null;

    if (imageFile) {
      const compressed = await imageCompression(imageFile, {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
      });

      const fileName = `${profile?.tenant_id}/${Date.now()}`;

      await supabase.storage.from("products").upload(fileName, compressed);

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      image_url = data.publicUrl;
    }

    await supabase.from("products").insert({
      name,
      price: Number(price),
      description,
      category_id: categoryId,
      tenant_id: profile?.tenant_id,
      image_url,
    });

    setName("");
    setPrice("");
    setDescription("");
    setCategoryId("");
    setPreview(null);

    fetchAll();
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Produtos</h1>

      <Button onClick={() => setShowCategoryModal(true)}>
        + Nova Categoria
      </Button>

      <div className="mt-6 space-y-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleCategoryDragEnd}
        >
          <SortableContext
            items={categories.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {categories.map((cat) => (
              <SortableItem key={cat.id} id={cat.id}>
                <div className="bg-white p-6 rounded-xl shadow">
                  <h2 className="font-bold mb-4">{cat.name}</h2>

                  {/* LISTA PRODUTOS */}
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(e) =>
                      handleProductDragEnd(e, cat.id)
                    }
                  >
                    <SortableContext
                      items={products
                        .filter((p) => p.category_id === cat.id)
                        .map((p) => p.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {products
                        .filter((p) => p.category_id === cat.id)
                        .map((product) => (
                          <SortableItem
                            key={product.id}
                            id={product.id}
                          >
                            <div className="flex justify-between border-b py-2 items-center">
                              <span>{product.name}</span>

                              {/* +1 estilo iFood */}
                              <button className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                                +1
                              </button>
                            </div>
                          </SortableItem>
                        ))}
                    </SortableContext>
                  </DndContext>

                  {/* FORM dentro da categoria */}
                  <form
                    onSubmit={handleSubmit}
                    className="mt-4 flex flex-col gap-2"
                  >
                    <input
                      placeholder="Nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border p-2 rounded"
                    />

                    <input
                      placeholder="Preço"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="border p-2 rounded"
                    />

                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageFile(file);
                          setPreview(URL.createObjectURL(file));
                        }
                      }}
                    />

                    <input
                      type="hidden"
                      value={cat.id}
                      onChange={() => setCategoryId(cat.id)}
                    />

                    <Button type="submit">Adicionar</Button>
                  </form>
                </div>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* MODAL CATEGORIA */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl">
            <input
              placeholder="Nome da categoria"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="border p-2 rounded mb-4"
            />

            <Button onClick={createCategory}>Criar</Button>
          </div>
        </div>
      )}
    </div>
  );
}