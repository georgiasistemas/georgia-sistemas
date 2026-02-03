'use client'

import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) return null // 🔥 elimina o piscar

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

  return (
    <main style={{ padding: 20 }}>
      <h1>Você já está logado</h1>
      <p>{user.email}</p>
    </main>
  )
}
