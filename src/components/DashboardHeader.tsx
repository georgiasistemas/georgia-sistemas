'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function DashboardHeader() {
  const { user, signOut } = useAuth()

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px',
        borderBottom: '1px solid #ccc'
      }}
    >
      <h2>Dashboard</h2>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <span>{user?.email}</span>

        <button onClick={signOut}>
          Sair
        </button>
      </div>
    </header>
  )
}