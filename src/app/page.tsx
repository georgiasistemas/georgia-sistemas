'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthProvider'

export const dynamic = 'force-dynamic'

export default function Page() {
  const [mounted, setMounted] = useState(false)
  const auth = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const { user } = auth

  return <div>{user?.email}</div>
}