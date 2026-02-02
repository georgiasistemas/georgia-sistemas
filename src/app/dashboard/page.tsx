'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Se não tiver usuário, sai imediatamente
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/')
    }
  }, [user, loading, router])

  if (loading) return <p>Carregando...</p>

  if (!user) return null // evita flicker

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <p>Usuário logado:</p>
      <pre>{user.email}</pre>

      <button onClick={handleLogout}>
        Sair
      </button>
    </main>
  )
}
