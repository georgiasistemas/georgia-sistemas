'use client'

import { ReactNode } from 'react'
import DashboardSidebar from '@/components/DashboardSidebar'
import DashboardHeader from '@/components/DashboardHeader'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <DashboardSidebar />

      <div style={{ flex: 1 }}>
        <DashboardHeader />
        <main style={{ padding: 24 }}>{children}</main>
      </div>
    </div>
  )
}

