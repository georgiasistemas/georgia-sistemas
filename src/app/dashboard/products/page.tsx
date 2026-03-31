"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";

export default function ProductsPage() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();

    if (!user) return alert("Usuário não autenticado");

    // buscar tenant
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.error(profileError);
      return alert("Erro ao buscar tenant do usuário");
    }

    const { error } = await supabase.from("products").insert({
      name,
      price: Number(price),
      tenant_id: profile.tenant_id,
    });

    if (error) {
      console.error(error);
      return alert("Erro ao cadastrar produto");
    }

    alert("Produto cadastrado com sucesso!");

    setName("");
    setPrice("");
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Produtos</h1>

      <form
        onSubmit={handleCreateProduct}
        className="bg-white p-6 rounded-xl shadow flex flex-col gap-4 max-w-md"
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

        <Button type="submit">
          Cadastrar Produto
        </Button>
      </form>
    </div>
  );
}