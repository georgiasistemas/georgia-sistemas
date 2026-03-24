'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type AuthContextType = {
user: any
profile: any
loading: boolean
signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
const [user, setUser] = useState<any>(null)
const [profile, setProfile] = useState<any>(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
// Pega usuário atual
const getUser = async () => {
const { data } = await supabase.auth.getUser()

```
  setUser(data?.user ?? null)

  // (Opcional) buscar profile depois
  setLoading(false)
}

getUser()

// Listener de mudanças de auth
const { data: listener } = supabase.auth.onAuthStateChange(
  (_event, session) => {
    setUser(session?.user ?? null)
  }
)

return () => {
  listener.subscription.unsubscribe()
}
```

}, [])

const signOut = async () => {
await supabase.auth.signOut()
}

return (
<AuthContext.Provider value={{ user, profile, loading, signOut }}>
{children}
</AuthContext.Provider>
)
}

export function useAuth() {
const context = useContext(AuthContext)

if (!context) {
throw new Error('useAuth deve ser usado dentro de um AuthProvider')
}

return context
}
