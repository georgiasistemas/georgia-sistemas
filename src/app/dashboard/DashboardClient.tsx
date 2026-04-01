"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardClient() {
  const { user } = useAuth();

  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    activeProducts: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      const { count: totalProducts } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      const { count: activeProducts } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("active", true);

      setMetrics({
        totalProducts: totalProducts || 0,
        activeProducts: activeProducts || 0,
      });

      setLoading(false);
    };

    fetchMetrics();
  }, []);

  if (!user) {
    return <p>Carregando ou não autenticado...</p>;
  }

  if (loading) {
    return <p>Carregando métricas...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <nav style={{ marginBottom: 20 }}>
        <Link href="/dashboard/products">Produtos</Link>
      </nav>

      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ border: "1px solid #ccc", padding: 20 }}>
          <p>Total de Produtos</p>
          <h2>{metrics.totalProducts}</h2>
        </div>

        <div style={{ border: "1px solid #ccc", padding: 20 }}>
          <p>Produtos Ativos</p>
          <h2>{metrics.activeProducts}</h2>
        </div>
      </div>
    </div>
  );
}