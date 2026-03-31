"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  function linkClass(path: string) {
    return `
      px-3 py-2 rounded-lg transition
      ${pathname === path
        ? "bg-white/20 font-semibold"
        : "hover:bg-white/10"}
    `;
  }

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-pink-600 text-white p-6 flex flex-col">
      
      <h2 className="text-2xl font-bold mb-10">
        Georgia Sistemas
      </h2>

      <nav className="flex flex-col gap-3 text-sm">
        <Link href="/dashboard" className={linkClass("/dashboard")}>
          Dashboard
        </Link>

        <Link href="/dashboard/products" className={linkClass("/dashboard/products")}>
          Produtos
        </Link>

        <Link href="/dashboard/orders" className={linkClass("/dashboard/orders")}>
          Pedidos
        </Link>

        <Link href="/dashboard/settings" className={linkClass("/dashboard/settings")}>
          Configurações
        </Link>
      </nav>

      <div className="mt-auto text-xs text-white/70 pt-10">
        v1.0 • SaaS Delivery
      </div>
    </aside>
  );
}