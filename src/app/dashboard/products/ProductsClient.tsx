"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function ProductsClient() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Produtos</h1>
      <p>{user ? user.email : "Usuário não logado"}</p>
    </div>
  );
}