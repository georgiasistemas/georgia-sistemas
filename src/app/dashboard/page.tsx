'use client'

import { useAuth } from '@/components/AuthProvider'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <>
      <h1>Dashboard</h1>
      <p>Você está logado como:</p>
      <strong>{user?.email}</strong>
    </>
  )
}
