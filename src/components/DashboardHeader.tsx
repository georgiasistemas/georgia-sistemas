'use client'

import { useAuth } from '@/contexts/AuthProvider'

export default function DashboardHeader() {
  const { user, signOut } = useAuth()

  return (
    <header
      style={{
        padding: '12px 24px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span>Área Administrativa</span>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span>{user?.email}</span>
        <button onClick={signOut}>Sair</button>
      </div>
    </header>
  )
}
