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
};

export default function ProductsPage() {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [user]);

  async function fetchProducts() {
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (!profile) return;

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("tenant_id", profile.tenant_id);

    setProducts(data || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (!profile) return alert("Erro ao buscar tenant");

    let finalImageUrl = imageUrl;

    // 🔥 PROCESSAMENTO DE IMAGEM
    if (imageFile) {
      if (imageFile.size > 2 * 1024 * 1024) {
        alert("Imagem deve ter no máximo 2MB");
        return;
      }

      const compressedFile = await imageCompression(imageFile, {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });

      const fileName = `${profile.tenant_id}/${Date.now()}-${compressedFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, compressedFile);

      if (uploadError) {
        console.log(uploadError);
        alert("Erro no upload da imagem");
        return;
      }

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      finalImageUrl = data.publicUrl;
    }

    if (editingId) {
      await supabase
        .from("products")
        .update({
          name,
          price: Number(price),
          description,
          ...(finalImageUrl && { image_url: finalImageUrl }),
        })
        .eq("id", editingId);

      setEditingId(null);
    } else {
      await supabase.from("products").insert({
        name,
        price: Number(price),
        description,
        tenant_id: profile.tenant_id,
        image_url: finalImageUrl || null,
      });
    }

    // LIMPA FORM
    setName("");
    setPrice("");
    setDescription("");
    setImageFile(null);
    setImageUrl("");
    setPreview(null);

    fetchProducts();
  }

  function handleEdit(product: Product) {
    setName(product.name);
    setPrice(String(product.price));
    setDescription(product.description || "");
    setEditingId(product.id);
    setImageUrl(product.image_url || "");
    setPreview(product.image_url || null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Deseja excluir este produto?")) return;

    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Produtos</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow flex flex-col gap-4 max-w-md mb-8"
      >
        <input
          type="text"
          placeholder="Nome do produto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <textarea
          placeholder="Descrição do produto"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />

        {/* UPLOAD */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setImageFile(file);

            if (file) {
              const previewUrl = URL.createObjectURL(file);
              setPreview(previewUrl);
            }
          }}
        />

        {/* PREVIEW */}
        {preview && (
          <img
            src={preview}
            className="w-24 h-24 object-cover rounded"
          />
        )}

        {/* URL */}
        <input
          type="text"
          placeholder="Ou URL da imagem"
          value={imageUrl}
          onChange={(e) => {
            setImageUrl(e.target.value);
            setPreview(e.target.value);
          }}
          className="border p-2 rounded"
        />

        <Button type="submit">
          {editingId ? "Atualizar Produto" : "Cadastrar Produto"}
        </Button>
      </form>

      {/* TABELA */}
      <div className="bg-white p-6 rounded-xl shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Imagem</th>
              <th className="p-2">Nome</th>
              <th className="p-2">Descrição</th>
              <th className="p-2">Preço</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-2">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </td>

                <td className="p-2">{product.name}</td>
                <td className="p-2">{product.description}</td>
                <td className="p-2">R$ {product.price}</td>

                <td className="p-2 flex gap-2">
                  <Button
                    onClick={() => handleEdit(product)}
                    className="!px-3 !py-1 text-sm"
                  >
                    Editar
                  </Button>

                  <Button
                    onClick={() => handleDelete(product.id)}
                    className="!px-3 !py-1 text-sm bg-red-500"
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Nenhum produto cadastrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}