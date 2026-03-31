"use client";

import Link from "next/link";

export default function DashboardSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-pink-600 text-white p-6">
      
      <h2 className="text-2xl font-bold mb-8">
        Georgia Sistemas
      </h2>

      <nav className="flex flex-col gap-4">
        <Link href="/dashboard" className="hover:opacity-80">
          Dashboard
        </Link>

        <Link href="/dashboard/products" className="hover:opacity-80">
          Produtos
        </Link>

        <Link href="/dashboard/orders" className="hover:opacity-80">
          Pedidos
        </Link>

        <Link href="/dashboard/settings" className="hover:opacity-80">
          Configurações
        </Link>
      </nav>

    </aside>
  );
}