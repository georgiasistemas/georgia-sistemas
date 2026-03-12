'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function DashboardHeader() {
  const { user, signOut } = useAuth()

  return (
    <header
      style={{
        height: '70px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 30px',
        background: '#fff'
      }}
    >
      <h3>Dashboard</h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span>{user?.email}</span>

        <button
          onClick={signOut}
          style={{
            padding: '8px 14px',
            cursor: 'pointer'
          }}
        >
          Sair
        </button>
      </div>
    </header>
  )
}