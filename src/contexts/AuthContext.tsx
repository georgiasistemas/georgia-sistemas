'use client'

import { createContext } from 'react'
import type { User } from '@supabase/supabase-js'

export type Profile = {
  id: string
  role: 'admin' | 'owner' | 'lojista'
  tenant_id: string | null
}

export type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
})
