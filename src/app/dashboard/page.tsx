'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [loading, user, router])

  if (loading) return <p>Carregando...</p>
  if (!user) return null

  return (
    <main style={{ padding: 20 }}>
      <h1>Dashboard do Lojista</h1>

      <p>Usuário logado:</p>
      <pre>{user.email}</pre>

      <p>🚧 Área do lojista em construção</p>
    </main>
  )
}
