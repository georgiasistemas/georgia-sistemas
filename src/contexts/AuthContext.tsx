import { createContext, useContext } from 'react'

export type UserRole = 'admin' | 'owner' | 'lojista'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  tenant_id: string | null
}

export interface AuthContextData {
  user: AuthUser | null
  loading: boolean
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
)

export const useAuth = () => useContext(AuthContext)
