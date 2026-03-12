'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/')
    }
  }, [user, loading, router])

  if (loading) return <p>Carregando...</p>

  if (!user) return null

  return (
    <div>
      <h1>Bem-vindo ao Georgia Sistemas</h1>

      <p>
        Este é o painel principal do sistema.
      </p>
    </div>
  )
}