"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type Order = {
  id: string;
  customer_name: string;
  total: number;
  status: string;
};

export default function OrdersPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [customerName, setCustomerName] = useState("");
  const [total, setTotal] = useState("");

  // 🔥 BUSCAR PEDIDOS (React Query)
  async function fetchOrders() {
    if (!user) return [];

    const { data: profile } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (!profile) return [];

    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("tenant_id", profile.tenant_id)
      .order("created_at", { ascending: false });

    return data || [];
  }

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: fetchOrders,
    enabled: !!user,
    refetchInterval: 5000,
    staleTime: 10000,
  });

  // ✅ CRIAR PEDIDO (COM INVALIDATE)
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!user) return;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      alert("Erro ao buscar tenant_id");
      return;
    }

    if (!profile.tenant_id) {
      alert("tenant_id está NULL");
      return;
    }

    const { error } = await supabase.from("orders").insert({
      customer_name: customerName,
      total: Number(total),
      tenant_id: profile.tenant_id,
      status: "pendente",
    });

    if (error) {
      console.log("INSERT ERROR:", error);
      alert("Erro ao criar pedido");
      return;
    }

    setCustomerName("");
    setTotal("");

    // 🔥 ATUALIZA INSTANTÂNEO
    queryClient.invalidateQueries({ queryKey: ["orders"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  }

  // 🔥 UPDATE STATUS COM REFRESH INSTANTÂNEO
  async function updateStatus(id: string, status: string) {
    await supabase.from("orders").update({ status }).eq("id", id);

    queryClient.invalidateQueries({ queryKey: ["orders"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  }

  // 🔥 DELETE COM REFRESH INSTANTÂNEO
  async function handleDelete(id: string) {
    if (!confirm("Excluir pedido?")) return;

    await supabase.from("orders").delete().eq("id", id);

    queryClient.invalidateQueries({ queryKey: ["orders"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "pendente":
        return "bg-yellow-100 text-yellow-700";
      case "preparando":
        return "bg-blue-100 text-blue-700";
      case "entregue":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100";
    }
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Pedidos</h1>

      {/* CRIAR PEDIDO */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded-xl shadow flex flex-col gap-4 max-w-md mb-8"
      >
        <input
          type="text"
          placeholder="Nome do cliente"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Total do pedido"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <Button type="submit">Criar Pedido</Button>
      </form>

      {/* LISTA */}
      <div className="bg-white p-6 rounded-xl shadow">
        {isLoading ? (
          <p>Carregando pedidos...</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Cliente</th>
                <th className="p-2">Total</th>
                <th className="p-2">Status</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order: Order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-2">{order.customer_name}</td>
                  <td className="p-2">R$ {order.total}</td>

                  <td className="p-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-2 flex gap-2 flex-wrap">
                    <Button
                      onClick={() =>
                        updateStatus(order.id, "preparando")
                      }
                      className="!px-2 !py-1 text-xs"
                    >
                      Preparando
                    </Button>

                    <Button
                      onClick={() =>
                        updateStatus(order.id, "entregue")
                      }
                      className="!px-2 !py-1 text-xs"
                    >
                      Entregue
                    </Button>

                    <Button
                      onClick={() => handleDelete(order.id)}
                      className="!px-2 !py-1 text-xs bg-red-500"
                    >
                      Excluir
                    </Button>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-4 text-gray-500"
                  >
                    Nenhum pedido ainda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}