'use client'

import { supabase } from '@/lib/supabase'

export default function Home() {
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

