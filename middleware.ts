import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  console.log('🔥 MIDDLEWARE RODANDO:', req.nextUrl.pathname)

  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')

  if (isDashboard) {
    // aqui por enquanto só loga, sem bloquear
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
