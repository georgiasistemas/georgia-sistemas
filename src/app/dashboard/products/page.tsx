"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
};

export default function ProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !price) return;

    const { error } = await supabase.from("products").insert([
      {
        name,
        price: Number(price),
      },
    ]);

    if (!error) {
      setName("");
      setPrice("");
      fetchProducts();
    } else {
      alert("Erro ao cadastrar produto");
    }
  }

  if (loading) return <p>Carregando...</p>;
  if (!user) return null;

  return (
    <div style={{ padding: 20 }}>
      <h1>Produtos</h1>

      {/* FORMULÁRIO */}
      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          placeholder="Nome do produto"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <br /><br />

        <button type="submit">Cadastrar</button>
      </form>

      <hr />

      {/* LISTAGEM */}
      <h2>Lista de produtos</h2>

      {products.length === 0 && <p>Nenhum produto cadastrado</p>}

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - R$ {product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}