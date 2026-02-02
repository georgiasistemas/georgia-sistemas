'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/')
    }
  }, [user, loading, router])

  if (loading) {
    return <p>Carregando...</p>
  }

  if (!user) {
    return null
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Acesso protegido com sucesso ✅</p>
      <p>Email do usuário:</p>
      <pre>{user.email}</pre>
    </main>
  )
}
