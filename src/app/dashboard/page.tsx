'use client'

import { useAuth } from '@/contexts/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <p>Carregando...</p>
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Usuário logado:</p>
      <pre>{user.email}</pre>

      <button onClick={signOut}>Sair</button>
    </div>
  )
}
