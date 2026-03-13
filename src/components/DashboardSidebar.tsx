'use client'

import Link from 'next/link'

export default function DashboardSidebar() {
  return (
    <aside
      style={{
        width: 220,
        background: '#111',
        color: '#fff',
        padding: 20,
      }}
    >
      <h2 style={{ marginBottom: 24 }}>Georgia Sistemas</h2>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link href="/dashboard" style={{ color: '#fff' }}>
          Dashboard
        </Link>

        <Link href="/dashboard/products" style={{ color: '#fff' }}>
          Produtos
        </Link>

        <Link href="/dashboard/pedidos" style={{ color: '#fff' }}>
          Pedidos
        </Link>
      </nav>
    </aside>
  )
}
