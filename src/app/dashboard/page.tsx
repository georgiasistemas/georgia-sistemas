'use client'

import { useAuth } from '@/components/AuthProvider'

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()

  if (loading) return null

  if (!user) {
    return null
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <p>Usuário logado:</p>
      <pre>{user.email}</pre>

      <button onClick={logout}>
        Sair
      </button>
    </main>
  )
}
