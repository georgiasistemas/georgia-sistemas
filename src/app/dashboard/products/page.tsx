"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export default function ProductsPage() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  async function handleCreateProduct() {
    try {
      if (!user) {
        alert("Usuário não autenticado");
        return;
      }

      // 🔥 BUSCAR TENANT DO USUÁRIO
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("tenant_id")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        console.error(profileError);
        alert("Erro ao buscar tenant do usuário");
        return;
      }

      // 🔥 INSERT DO PRODUTO
      const { error } = await supabase.from("products").insert([
        {
          name,
          price: Number(price),
          tenant_id: profile.tenant_id,
          active: true,
        },
      ]);

      if (error) {
        console.error(error);
        alert("Erro ao cadastrar produto");
        return;
      }

      alert("Produto cadastrado com sucesso!");

      // limpar campos
      setName("");
      setPrice("");
    } catch (err) {
      console.error(err);
      alert("Erro inesperado");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Cadastro de Produtos</h1>

      <input
        type="text"
        placeholder="Nome do produto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <input
        type="number"
        placeholder="Preço"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <button onClick={handleCreateProduct}>
        Cadastrar Produto
      </button>
    </div>
  );
}