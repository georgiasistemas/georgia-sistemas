'use client'

import { createContext, useContext } from 'react'
import type { User } from '@supabase/supabase-js'

export type Profile = {
  id: string
  role: string
  tenant_id: string | null
}

export type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
)

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider')
  }

  return context
}
