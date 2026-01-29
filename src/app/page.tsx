'use client'

import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) return <p>Carregando...</p>

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
      <h1>Bem-vindo</h1>

      <p>Usuário logado:</p>
      <pre>{user.email}</pre>

      <button onClick={() => supabase.auth.signOut()}>
        Sair
      </button>
    </main>
  )
}
