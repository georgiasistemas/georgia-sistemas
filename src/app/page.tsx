'use client'

import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return <p>Carregando...</p>
  }

  if (!user) {
    return (
      <main style={{ padding: 20 }}>
        <h1>Georgia Sistemas</h1>

        <button
          onClick={async () => {
            const { error } = await supabase.auth.signInWithPassword({
              email: 'lojista@exemplo.com',
              password: '12345678'
            })

            if (error) {
              alert(error.message)
            }
          }}
        >
          Entrar como lojista
        </button>
      </main>
    )
  }

  return (
    <main style={{ padding: 20 }}>
      <h2>Você já está logado</h2>
      <p>{user.email}</p>
    </main>
  )
}
