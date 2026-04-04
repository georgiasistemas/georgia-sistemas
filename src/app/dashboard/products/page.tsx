"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";
import imageCompression from "browser-image-compression";

type Product = {
  id: string;
  name: string;
  price: number;
  image_url?: string | null;
  description?: string | null;
  category_id?: string | null;
  active?: boolean;
};

type Group = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
  active?: boolean;
};

export default function ProductsPage() {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  // MODAIS
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupRequired, setGroupRequired] = useState(false);
  const [minSelect, setMinSelect] = useState(0);
  const [maxSelect, setMaxSelect] = useState(1);

  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchGroups();
    fetchCategories();
  }, [user]);

  async function getTenant() {
    const { data } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", user?.id)
      .single();

    return data?.tenant_id;
  }

  async function fetchCategories() {
    const tenantId = await getTenant();

    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("tenant_id", tenantId);

    setCategories(data || []);
  }

  async function fetchGroups() {
    const tenantId = await getTenant();

    const { data } = await supabase
      .from("product_groups")
      .select("id, name")
      .eq("tenant_id", tenantId);

    setGroups(data || []);
  }

  async function fetchProducts() {
    const tenantId = await getTenant();

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("tenant_id", tenantId);

    setProducts(data || []);
  }

  // ATIVAR / PAUSAR
  async function toggleCategory(id: string, active: boolean) {
    await supabase.from("categories").update({ active }).eq("id", id);
    fetchCategories();
  }

  async function toggleProduct(id: string, active: boolean) {
    await supabase.from("products").update({ active }).eq("id", id);
    fetchProducts();
  }

  // DELETE
  async function deleteCategory(id: string) {
    if (!confirm("Excluir categoria?")) return;
    await supabase.from("categories").delete().eq("id", id);
    fetchCategories();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Excluir produto?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  }

  function toggleGroup(id: string) {
    setSelectedGroups((prev) =>
      prev.includes(id)
        ? prev.filter((g) => g !== id)
        : [...prev, id]
    );
  }

  async function createCategory() {
    const tenantId = await getTenant();

    await supabase.from("categories").insert({
      name: newCategoryName,
      tenant_id: tenantId,
      active: true,
    });

    setNewCategoryName("");
    setShowCategoryModal(false);
    fetchCategories();
  }

  async function createGroup() {
    const tenantId = await getTenant();

    const { data } = await supabase
      .from("product_groups")
      .insert({
        name: groupName,
        required: groupRequired,
        min_select: minSelect,
        max_select: maxSelect,
        tenant_id: tenantId,
      })
      .select()
      .single();

    setShowGroupModal(false);
    setGroupName("");
    setGroupRequired(false);
    setMinSelect(0);
    setMaxSelect(1);

    fetchGroups();

    if (data) {
      setSelectedGroups((prev) => [...prev, data.id]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const tenantId = await getTenant();

    let finalImageUrl = imageUrl;

    if (imageFile) {
      const compressedFile = await imageCompression(imageFile, {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
      });

      const fileName = `${tenantId}/${Date.now()}-${compressedFile.name}`;

      await supabase.storage.from("products").upload(fileName, compressedFile);

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      finalImageUrl = data.publicUrl;
    }

    let productId = editingId;

    if (editingId) {
      await supabase
        .from("products")
        .update({
          name,
          price: Number(price),
          description,
          category_id: categoryId || null,
          ...(finalImageUrl && { image_url: finalImageUrl }),
        })
        .eq("id", editingId);
    } else {
      const { data } = await supabase
        .from("products")
        .insert({
          name,
          price: Number(price),
          description,
          tenant_id: tenantId,
          category_id: categoryId || null,
          image_url: finalImageUrl || null,
          active: true,
        })
        .select()
        .single();

      productId = data.id;
    }

    await supabase
      .from("product_group_links")
      .delete()
      .eq("product_id", productId);

    if (selectedGroups.length > 0) {
      await supabase.from("product_group_links").insert(
        selectedGroups.map((g) => ({
          product_id: productId,
          group_id: g,
        }))
      );
    }

    setName("");
    setPrice("");
    setDescription("");
    setCategoryId("");
    setSelectedGroups([]);
    setPreview(null);
    setImageFile(null);
    setImageUrl("");
    setEditingId(null);

    fetchProducts();
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Produtos</h1>

      <Button onClick={() => setShowCategoryModal(true)} className="mb-6">
        + Nova Categoria
      </Button>

      {/* LISTAGEM */}
      {categories.map((category) => (
        <div key={category.id} className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">
              {category.name} {!category.active && "(Pausado)"}
            </h2>

            <div className="flex gap-2">
              <Button
                onClick={() =>
                  toggleCategory(category.id, !category.active)
                }
                className="!px-2 !py-1 text-xs"
              >
                {category.active ? "Pausar" : "Ativar"}
              </Button>

              <Button
                onClick={() => deleteCategory(category.id)}
                className="!px-2 !py-1 text-xs bg-red-500"
              >
                Excluir
              </Button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow space-y-2">
            {products
              .filter((p) => p.category_id === category.id)
              .map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p>{product.name}</p>
                    <p className="text-sm text-gray-500">
                      R$ {product.price}
                    </p>
                    {!product.active && (
                      <span className="text-xs text-red-500">
                        Pausado
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        toggleProduct(product.id, !product.active)
                      }
                      className="!px-2 !py-1 text-xs"
                    >
                      {product.active ? "Pausar" : "Ativar"}
                    </Button>

                    <Button
                      onClick={() => deleteProduct(product.id)}
                      className="!px-2 !py-1 text-xs bg-red-500"
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow flex flex-col gap-4 max-w-md"
      >
        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />

        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          placeholder="URL da imagem"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
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

        {preview && <img src={preview} className="w-24 h-24 rounded" />}

        {/* COMPLEMENTOS */}
        <div className="bg-gray-50 p-4 rounded-xl border">
          <div className="flex justify-between mb-3">
            <p className="font-semibold">Complementos</p>

            <button
              type="button"
              onClick={() => setShowGroupModal(true)}
              className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm"
            >
              + Criar Grupo
            </button>
          </div>

          {groups.map((group) => (
            <label key={group.id} className="flex gap-2">
              <input
                type="checkbox"
                checked={selectedGroups.includes(group.id)}
                onChange={() => toggleGroup(group.id)}
              />
              {group.name}
            </label>
          ))}
        </div>

        <Button type="submit">Salvar Produto</Button>
      </form>

      {/* MODAL GRUPO (iFood style) */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Novo Grupo</h2>

            <input
              placeholder="Nome do grupo"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />

            <label className="flex gap-2 mb-4">
              <input
                type="checkbox"
                checked={groupRequired}
                onChange={(e) => setGroupRequired(e.target.checked)}
              />
              Obrigatório
            </label>

            {/* IFOOD STYLE */}
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-sm">Mínimo</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setMinSelect(Math.max(0, minSelect - 1))}>-</button>
                  <span>{minSelect}</span>
                  <button onClick={() => setMinSelect(minSelect + 1)}>+</button>
                </div>
              </div>

              <div>
                <p className="text-sm">Máximo</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setMaxSelect(Math.max(1, maxSelect - 1))}>-</button>
                  <span>{maxSelect}</span>
                  <button onClick={() => setMaxSelect(maxSelect + 1)}>+</button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button onClick={() => setShowGroupModal(false)}>
                Cancelar
              </Button>

              <Button onClick={createGroup}>Criar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}