import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  if (pathname.startsWith('/photographer/dashboard') && session.user.role !== 'PHOTOGRAPHER') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (pathname.startsWith('/consumer/dashboard') && session.user.role !== 'CONSUMER') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/photographer/dashboard/:path*', '/consumer/dashboard/:path*', '/messages/:path*', '/messages'],
}
