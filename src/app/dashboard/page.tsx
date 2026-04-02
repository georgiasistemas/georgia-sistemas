"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      // Produtos
      const { count: totalProducts } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      const { count: activeProducts } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("active", true);

      // Pedidos
      const { data: orders } = await supabase
        .from("orders")
        .select("total");

      const totalOrders = orders?.length || 0;

      // Receita
      const revenue =
        orders?.reduce((acc, order) => acc + Number(order.total), 0) || 0;

      setMetrics({
        totalProducts: totalProducts || 0,
        activeProducts: activeProducts || 0,
        totalOrders,
        revenue,
      });

      setLoading(false);
    };

    fetchMetrics();
  }, []);

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* Boas-vindas */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <p className="text-gray-700">
          Bem-vindo ao sistema 🎉
        </p>
      </div>

      {/* Métricas */}
      {loading ? (
        <p>Carregando métricas...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 text-sm">
              Total de Produtos
            </p>
            <h2 className="text-2xl font-bold">
              {metrics.totalProducts}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 text-sm">
              Produtos Ativos
            </p>
            <h2 className="text-2xl font-bold">
              {metrics.activeProducts}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 text-sm">
              Total de Pedidos
            </p>
            <h2 className="text-2xl font-bold">
              {metrics.totalOrders}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 text-sm">
              Receita Total
            </p>
            <h2 className="text-2xl font-bold text-green-600">
              R$ {metrics.revenue.toFixed(2)}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}