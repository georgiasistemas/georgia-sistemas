'use client'

import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  if (loading) return null

  if (!user) {
    return (
      <main style={{ padding: 20 }}>
        <h1>Georgia Sistemas</h1>

        <button
          onClick={() =>
            supabase.auth.signInWithPassword({
              email: 'lojista@exemplo.com',
              password: '12345678',
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
      <h1>Georgia Sistemas</h1>

      <p>Usuário logado:</p>
      <pre>{user.email}</pre>

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => router.push('/dashboard')}>
          Ir para Dashboard
        </button>

        <button onClick={logout}>
          Sair
        </button>
      </div>
    </main>
  )
}
