'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return <p>Carregando...</p>
  }

  if (!user) {
    return (
      <main style={{ padding: 20 }}>
        <h1>Georgia Sistemas</h1>
        <button
          onClick={() =>
            supabase.auth.signInWithPassword({
              email: 'lojista@exemplo.com',
              password: '12345678'
            })
          }
        >
          Entrar como lojista
        </button>
      </main>
    )
  }

  return null
}
