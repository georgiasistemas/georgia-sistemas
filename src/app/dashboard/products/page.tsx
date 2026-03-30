"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function ProductsPage() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);

    const { data: profile } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", user?.id)
      .single();

    if (!profile) return;

    setTenantId(profile.tenant_id);

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("tenant_id", profile.tenant_id)
      .order("created_at", { ascending: false });

    setProducts(data || []);
    setLoading(false);
  }

  async function createProduct() {
    if (!tenantId) return;

    await supabase.from("products").insert([
      { name, price: Number(price), tenant_id: tenantId },
    ]);

    setName("");
    setPrice("");
    loadData();
  }

  async function updateProduct(p: any) {
    await supabase
      .from("products")
      .update({ name: p.name, price: p.price })
      .eq("id", p.id);
  }

  async function deleteProduct(id: string) {
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Produtos</h1>

      {/* FORM */}
      <div className="bg-white shadow rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold">Novo Produto</h2>

        <input
          className="border rounded-xl p-2 w-full"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border rounded-xl p-2 w-full"
          placeholder="Preço"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button
          onClick={createProduct}
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          Cadastrar
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white shadow rounded-2xl p-4">
        <h2 className="font-semibold mb-4">Lista</h2>

        {products.length === 0 && (
          <p className="text-gray-500">Nenhum produto</p>
        )}

        <div className="space-y-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex gap-2 items-center border p-2 rounded-xl"
            >
              <input
                className="border p-2 rounded w-full"
                value={p.name}
                onChange={(e) =>
                  setProducts((prev) =>
                    prev.map((x) =>
                      x.id === p.id ? { ...x, name: e.target.value } : x
                    )
                  )
                }
              />

              <input
                type="number"
                className="border p-2 rounded w-32"
                value={p.price}
                onChange={(e) =>
                  setProducts((prev) =>
                    prev.map((x) =>
                      x.id === p.id
                        ? { ...x, price: Number(e.target.value) }
                        : x
                    )
                  )
                }
              />

              <button
                onClick={() => updateProduct(p)}
                className="bg-blue-500 text-white px-3 py-2 rounded-xl"
              >
                Salvar
              </button>

              <button
                onClick={() => deleteProduct(p.id)}
                className="bg-red-500 text-white px-3 py-2 rounded-xl"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
