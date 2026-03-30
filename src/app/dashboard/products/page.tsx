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

      // 🔥 Buscar tenant do usuário
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

      // 🔥 Buscar produtos do tenant
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("tenant_id", profile.tenant_id)
        .order("created_at", { ascending: false });

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

      loadProfileAndProducts();
    } catch (err) {
      console.error(err);
      alert("Erro inesperado");
    }
  }

  async function handleUpdateProduct(product: Product) {
    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: product.name,
          price: product.price,
        })
        .eq("id", product.id);

      if (error) {
        console.error(error);
        alert("Erro ao atualizar produto");
        return;
      }

      alert("Produto atualizado com sucesso");
    } catch (err) {
      console.error(err);
      alert("Erro inesperado");
    }
  }

  async function handleDeleteProduct(id: string) {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(error);
        alert("Erro ao deletar produto");
        return;
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
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
            <li key={product.id} style={{ marginBottom: 10 }}>
              <input
                type="text"
                value={product.name}
                onChange={(e) =>
                  setProducts((prev) =>
                    prev.map((p) =>
                      p.id === product.id
                        ? { ...p, name: e.target.value }
                        : p
                    )
                  )
                }
              />

              <input
                type="number"
                value={product.price}
                onChange={(e) =>
                  setProducts((prev) =>
                    prev.map((p) =>
                      p.id === product.id
                        ? { ...p, price: Number(e.target.value) }
                        : p
                    )
                  )
                }
                style={{ marginLeft: 10 }}
              />

              <button
                onClick={() => handleUpdateProduct(product)}
                style={{ marginLeft: 10 }}
              >
                Salvar
              </button>

              <button
                onClick={() => handleDeleteProduct(product.id)}
                style={{ marginLeft: 10 }}
              >
                Deletar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}