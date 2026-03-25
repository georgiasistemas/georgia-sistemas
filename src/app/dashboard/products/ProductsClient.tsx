"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
};

export default function ProductsClient() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  // 🔄 carregar produtos
  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Erro ao buscar produtos:", error.message);
    } else {
      setProducts(data || []);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // ➕ cadastrar produto
  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("products").insert([
      {
        name,
        price: Number(price),
      },
    ]);

    if (error) {
      console.error("Erro ao cadastrar:", error.message);
      alert("Erro ao cadastrar produto");
      return;
    }

    setName("");
    setPrice("");
    fetchProducts();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Produtos</h1>
      <p>{user ? user.email : "Usuário não logado"}</p>

      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          placeholder="Nome do produto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <button type="submit">Cadastrar</button>
      </form>

      <hr />

      <h2>Lista de Produtos</h2>

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