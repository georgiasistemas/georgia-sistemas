'use client'

import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard')
    }
  }, [user, loading, router])

  if (loading || user) {
    return <p>Redirecionando...</p>
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Georgia Sistemas</h1>

      <button
        onClick={async () => {
          const { error } = await supabase.auth.signInWithPassword({
            email: 'lojista@exemplo.com',
            password: '12345678',
          })

          if (error) alert(error.message)
        }}
      >
        Entrar como lojista
      </button>
    </main>
  )
}
