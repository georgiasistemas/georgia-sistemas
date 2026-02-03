'use client'

import { useAuth } from '@/components/AuthProvider'

export default function DashboardPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <p>Carregando dashboard...</p>
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao sistema Georgia Sistemas.</p>

      {user && (
        <p style={{ marginTop: 12 }}>
          Usuário logado: <strong>{user.email}</strong>
        </p>
      )}
    </div>
  )
}
