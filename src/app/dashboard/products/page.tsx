"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function ProductsPage() {
  const { user } = useAuth();

  // DEBUG (IMPORTANTE)
  console.log("USER LOGADO ID:", user?.id);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  async function handleCreateProduct() {
    try {
      if (!user) {
        alert("Usuário não logado");
        return;
      }

      // Buscar tenant do usuário
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

      // Inserir produto
      const { error } = await supabase.from("products").insert([
        {
          name,
          price: Number(price),
          tenant_id: profile.tenant_id,
        },
      ]);

      if (error) {
        console.error(error);
        alert("Erro ao cadastrar produto");
        return;
      }

      alert("Produto cadastrado com sucesso");

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

      <p>
        Usuário: {user ? user.email : "Não logado"}
      </p>

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