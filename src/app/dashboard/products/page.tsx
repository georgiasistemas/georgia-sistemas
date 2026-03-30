"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
};

export default function ProductsPage() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfileAndProducts();
    }
  }, [user]);

  async function loadProfileAndProducts() {
    try {
      setLoading(true);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("tenant_id")
        .eq("id", user?.id)
        .single();

      if (error || !profile) {
        console.error(error);
        alert("Erro ao carregar perfil");
        return;
      }

      setTenantId(profile.tenant_id);

      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("tenant_id", profile.tenant_id);

      if (productsError) {
        console.error(productsError);
        alert("Erro ao carregar produtos");
        return;
      }

      setProducts(productsData || []);
    } catch (err) {
      console.error(err);
      alert("Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProduct() {
    try {
      if (!tenantId) {
        alert("Tenant não encontrado");
        return;
      }

      const { error } = await supabase.from("products").insert([
        {
          name,
          price: Number(price),
          tenant_id: tenantId,
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

      // 🔥 recarrega lista
      loadProfileAndProducts();
    } catch (err) {
      console.error(err);
      alert("Erro inesperado");
    }
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Produtos</h1>

      <p>Usuário: {user?.email}</p>

      {/* FORMULÁRIO */}
      <div style={{ marginBottom: 20 }}>
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

      {/* LISTA */}
      <h2>Lista de Produtos</h2>

      {products.length === 0 ? (
        <p>Nenhum produto cadastrado</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - R$ {product.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}