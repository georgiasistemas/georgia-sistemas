import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  console.log('🔥 MIDDLEWARE RODANDO:', req.nextUrl.pathname)

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
