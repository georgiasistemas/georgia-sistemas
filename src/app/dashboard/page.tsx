'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()
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
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>

      <p>
        <strong>Email:</strong> {user?.email}
      </p>

      {profile && (
        <>
          <p>
            <strong>Role:</strong> {profile.role}
          </p>

          <p>
            <strong>Tenant:</strong> {profile.tenant_id}
          </p>
        </>
      )}
    </div>
  )
}