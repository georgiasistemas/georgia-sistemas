'use client'

import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // 🔁 se já estiver logado, vai direto pro dashboard
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

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

  // enquanto redireciona
  return <p>Redirecionando...</p>
}
