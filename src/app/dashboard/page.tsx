'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import DashboardHeader from '@/components/DashboardHeader'

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
    <div>
      <DashboardHeader />

      <main style={{ padding: 40 }}>
        <h1>Painel do Sistema</h1>

        <p>Bem-vindo ao Georgia Sistemas.</p>

        <p>Usuário logado: {user.email}</p>
      </main>
    </div>
  )
}