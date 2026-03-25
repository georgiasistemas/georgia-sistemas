"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <p>Carregando...</p>;
  if (!user) return null;

  return (
    <div>
      <h1>Produtos</h1>
      <p>Usuário: {user.email}</p>
    </div>
  );
}