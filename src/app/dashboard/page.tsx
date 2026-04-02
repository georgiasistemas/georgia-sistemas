"use client";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

type Order = {
  id: string;
  total: number;
  status: string;
  customer_name: string;
  created_at: string;
};

export default function Dashboard() {
  const { user } = useAuth();

  // 🔥 FUNÇÃO COMPLETA (mantendo sua lógica + BI)
  async function fetchData() {
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (!profile) return null;

    const tenantId = profile.tenant_id;

    // Produtos
    const { count: totalProducts } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId);

    const { count: activeProducts } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("active", true);

    // 🔥 TODOS OS PEDIDOS (para gráfico)
    const { data: allOrders } = await supabase
      .from("orders")
      .select("*")
      .eq("tenant_id", tenantId);

    // 🔥 ÚLTIMOS PEDIDOS (igual você já tinha)
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })
      .limit(5);

    // 🔥 AGRUPAR POR DATA
    const grouped: Record<string, number> = {};

    allOrders?.forEach((order) => {
      const date = dayjs(order.created_at).format("DD/MM");
      grouped[date] = (grouped[date] || 0) + Number(order.total);
    });

    const chartData = Object.entries(grouped)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => {
        const [d1, m1] = a.date.split("/");
        const [d2, m2] = b.date.split("/");
        return Number(m1 + d1) - Number(m2 + d2);
      });

    const chart7 = chartData.slice(-7);
    const chart30 = chartData.slice(-30);

    const totalOrders = allOrders?.length || 0;

    const revenue =
      allOrders?.reduce((acc, o) => acc + Number(o.total), 0) || 0;

    return {
      metrics: {
        totalProducts: totalProducts || 0,
        activeProducts: activeProducts || 0,
        totalOrders,
        revenue,
      },
      orders: ordersData || [],
      chart7,
      chart30,
    };
  }

  // 🚀 REACT QUERY
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", user?.id],
    queryFn: fetchData,
    enabled: !!user,
    refetchInterval: 5000,
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });

  if (!user) {
    return <p className="p-10">Carregando...</p>;
  }

  if (isLoading || !data) {
    return <p className="p-10">Carregando métricas...</p>;
  }

  const { metrics, orders, chart7, chart30 } = data;

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* Boas-vindas */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <p className="text-gray-700">
          Bem-vindo ao sistema 🎉
        </p>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Produtos</p>
          <h2 className="text-2xl font-bold">
            {metrics.totalProducts}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Ativos</p>
          <h2 className="text-2xl font-bold">
            {metrics.activeProducts}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Pedidos</p>
          <h2 className="text-2xl font-bold">
            {metrics.totalOrders}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Receita</p>
          <h2 className="text-2xl font-bold text-green-600">
            R$ {metrics.revenue.toFixed(2)}
          </h2>
        </div>
      </div>

      {/* 🔥 GRÁFICO 7 DIAS */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-4">
          Receita - últimos 7 dias
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chart7}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🔥 GRÁFICO 30 DIAS */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-4">
          Receita - últimos 30 dias
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chart30}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Últimos pedidos */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          Últimos pedidos
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-500">
            Nenhum pedido ainda
          </p>
        ) : (
          <ul className="space-y-3">
            {orders.map((order: Order) => (
              <li
                key={order.id}
                className="flex justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">
                    {order.customer_name || "Sem nome"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.status}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    R$ {order.total}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}