import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow admin routes through so you can still work
  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Allow the maintenance page itself through (avoid redirect loop)
  if (pathname === '/maintenance') {
    return NextResponse.next()
  }

  // Allow Next.js internals and static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/studio') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Redirect everything else to maintenance page
  return NextResponse.redirect(new URL('/maintenance', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
