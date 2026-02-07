'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthProvider'

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  console.log('USER:', user)
console.log('PROFILE:', profile)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/')
    }
  }, [loading, user, router])

  if (loading) {
    return <p>Carregando...</p>
  }

  if (!user) {
    return null
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao sistema Georgia Sistemas.</p>

      <button onClick={logout}>Sair</button>
    </div>
  )
}

