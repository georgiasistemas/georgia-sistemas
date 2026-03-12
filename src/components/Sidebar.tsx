'use client'

import Link from 'next/link'

export default function Sidebar() {
  return (
    <aside
      style={{
        width: '220px',
        background: '#0f172a',
        color: '#fff',
        padding: '20px',
        minHeight: '100vh'
      }}
    >
      <h2 style={{ marginBottom: '30px' }}>Georgia Sistemas</h2>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Link href="/dashboard" style={{ color: '#fff' }}>
          Dashboard
        </Link>

        <Link href="/dashboard/produtos" style={{ color: '#fff' }}>
          Produtos
        </Link>

        <Link href="/dashboard/pedidos" style={{ color: '#fff' }}>
          Pedidos
        </Link>

        <Link href="/dashboard/configuracoes" style={{ color: '#fff' }}>
          Configurações
        </Link>
      </nav>
    </aside>
  )
}