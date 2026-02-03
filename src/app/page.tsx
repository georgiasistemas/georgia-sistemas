'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: 'lojista@exemplo.com',
      password: '12345678',
    })

    setLoading(false)

    if (!error) {
      router.push('/dashboard')
    } else {
      alert('Erro ao logar')
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Georgia Sistemas</h1>

      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar como lojista'}
      </button>
    </main>
  )
}
