'use client'

import { useAuth } from '@/contexts/AuthProvider'

export default function DashboardHeader() {
  const { user, logout } = useAuth()

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem',
        borderBottom: '1px solid #ccc',
      }}
    >
      <strong>Georgia Sistemas</strong>

      {user && (
        <button onClick={logout}>
          Sair
        </button>
      )}
    </header>
  )
}
