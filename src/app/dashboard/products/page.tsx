"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function ProductsPage() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      console.log("USER PRONTO:", user.id);
      setLoading(false);
    }
  }, [user]);

  async function handleCreateProduct() {
    try {
      if (!user) {
        alert("Usuário ainda não carregado");
        return;
      }

      console.log("Buscando profile com ID:", user.id);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("tenant_id")
        .eq("id", user.id)
        .maybeSingle();

      console.log("PROFILE:", profile);
      console.log("PROFILE ERROR:", profileError);

      if (!profile) {
        alert("Profile não encontrado");
        return;
      }

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

  if (loading) {
    return <p>Carregando usuário...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Cadastro de Produtos</h1>

      <p>Usuário: {user?.email}</p>

      <input
        type="text"
        placeholder="Nome do produto"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Preço"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button onClick={handleCreateProduct}>
        Cadastrar Produto
      </button>
    </div>
  );
}