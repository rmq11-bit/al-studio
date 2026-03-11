import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Use optional chaining: session.user is typed as optional in NextAuth v5.
  // Without it, accessing session.user.role throws when user is undefined.
  const role = (session?.user as any)?.role as string | undefined

  if (pathname.startsWith('/photographer/dashboard') && role !== 'PHOTOGRAPHER') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (pathname.startsWith('/consumer/dashboard') && role !== 'CONSUMER') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Admin routes: only ADMIN role may enter; everyone else goes home
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/photographer/dashboard/:path*',
    '/consumer/dashboard/:path*',
    '/messages/:path*',
    '/messages',
    '/admin',
    '/admin/:path*',
  ],
}
