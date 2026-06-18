import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) return NextResponse.next()
  if (pathname === '/maintenance') return NextResponse.next()
  if (pathname.startsWith('/_next') || pathname.startsWith('/studio') || pathname === '/favicon.ico') return NextResponse.next()

  return NextResponse.redirect(new URL('/maintenance', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
