"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

type Order = {
  id: string;
  total: number;
  status: string;
  customer_name: string;
  created_at: string;
};

export default function Dashboard() {
  const { user } = useAuth();

  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    revenue: 0,
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FUNÇÃO REUTILIZÁVEL
  async function fetchData() {
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (!profile) return;

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

    // Pedidos
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })
      .limit(5);

    const totalOrders = ordersData?.length || 0;

    const revenue =
      ordersData?.reduce((acc, order) => acc + Number(order.total), 0) || 0;

    setMetrics({
      totalProducts: totalProducts || 0,
      activeProducts: activeProducts || 0,
      totalOrders,
      revenue,
    });

    setOrders(ordersData || []);
    setLoading(false);
  }

  // 🔄 CHAMA AO CARREGAR
  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  if (!user) {
    return <p className="p-10">Carregando...</p>;
  }

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
        <>
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
                {orders.map((order) => (
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
        </>
      )}
    </div>
  );
}