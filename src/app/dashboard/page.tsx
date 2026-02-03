'use client'

import { useAuth } from '@/components/AuthProvider'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/')
    }
  }, [user, loading, router])

  if (loading) return <p>Carregando...</p>

  if (!user) return null

  return (
    <main style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <p>Usuário logado:</p>
      <pre>{user.email}</pre>

      <button onClick={logout}>Sair</button>
    </main>
  )
}
