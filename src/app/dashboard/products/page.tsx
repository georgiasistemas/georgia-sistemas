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
};

type Group = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
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

  // 🔥 MODAIS
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
    if (!user) return;
    const tenantId = await getTenant();

    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("tenant_id", tenantId);

    setCategories(data || []);
  }

  async function fetchGroups() {
    if (!user) return;
    const tenantId = await getTenant();

    const { data } = await supabase
      .from("product_groups")
      .select("id, name")
      .eq("tenant_id", tenantId);

    setGroups(data || []);
  }

  async function fetchProducts() {
    if (!user) return;
    const tenantId = await getTenant();

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("tenant_id", tenantId);

    setProducts(data || []);
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

      {/* 🔥 BOTÃO NOVA CATEGORIA */}
      <Button onClick={() => setShowCategoryModal(true)} className="mb-6">
        + Nova Categoria
      </Button>

      {/* LISTA POR CATEGORIA */}
      {categories.map((category) => (
        <div key={category.id} className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold">{category.name}</h2>

            <Button
              className="!px-3 !py-1 text-sm"
              onClick={() => setCategoryId(category.id)}
            >
              +1 Novo Produto
            </Button>
          </div>

          <div className="bg-white p-4 rounded-xl shadow space-y-3">
            {products
              .filter((p) => p.category_id === category.id)
              .map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      R$ {product.price}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* FORM (MANTIDO) */}
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

        {/* URL IMAGEM */}
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

        {/* COMPLEMENTOS (MANTIDO) */}
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

      {/* MODAL CATEGORIA */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nova Categoria</h2>

            <input
              placeholder="Nome da categoria"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />

            <div className="flex justify-end gap-2">
              <Button onClick={() => setShowCategoryModal(false)}>
                Cancelar
              </Button>

              <Button onClick={createCategory}>
                Criar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL GRUPO (MANTIDO) */}
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

            <label className="flex gap-2 mb-2">
              <input
                type="checkbox"
                checked={groupRequired}
                onChange={(e) => setGroupRequired(e.target.checked)}
              />
              Obrigatório
            </label>

            <input
              type="number"
              placeholder="Mínimo"
              value={minSelect}
              onChange={(e) => setMinSelect(Number(e.target.value))}
              className="border p-2 rounded w-full mb-2"
            />

            <input
              type="number"
              placeholder="Máximo"
              value={maxSelect}
              onChange={(e) => setMaxSelect(Number(e.target.value))}
              className="border p-2 rounded w-full mb-4"
            />

            <div className="flex justify-end gap-2">
              <Button onClick={() => setShowGroupModal(false)}>
                Cancelar
              </Button>

              <Button onClick={createGroup}>
                Criar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}