'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  // 🔍 TESTE 2 — INSPEÇÃO NO CONSOLE
  console.log('USER:', user)
  console.log('PROFILE:', profile)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return <p>Carregando...</p>
  }

  if (!user) {
    return <p>Redirecionando...</p>
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <p><strong>Email:</strong> {user.email}</p>

      {profile ? (
        <>
          <p><strong>Role:</strong> {profile.role}</p>
          <p><strong>Tenant ID:</strong> {profile.tenant_id}</p>
        </>
      ) : (
        <p>Perfil não carregado</p>
      )}
    </div>
  )
}


