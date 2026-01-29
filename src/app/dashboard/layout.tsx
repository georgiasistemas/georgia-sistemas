'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) return <p>Carregando...</p>

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside
        style={{
          width: 220,
          padding: 20,
          background: '#111',
          color: '#fff'
        }}
      >
        <h2>Georgia</h2>
        <nav style={{ marginTop: 20 }}>
          <p>Dashboard</p>
          <p>Pedidos</p>
          <p>Produtos</p>
          <p>Configurações</p>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 20 }}>
        {children}
      </main>
    </div>
  )
}
