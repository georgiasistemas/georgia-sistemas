"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardClient() {
  const { user } = useAuth();

  if (!user) {
    return <p>Carregando ou não autenticado...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <nav>
        <Link href="/dashboard/products">Produtos</Link>
      </nav>
    </div>
  );
}