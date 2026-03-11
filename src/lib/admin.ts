/**
 * Admin guard helper.
 *
 * Call `await requireAdmin()` at the top of every admin server component / action.
 * Returns the session so callers don't have to call auth() again.
 */
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function requireAdmin() {
  const session = await auth()
  const role = (session?.user as any)?.role as string | undefined
  if (!session || role !== 'ADMIN') redirect('/')
  return session
}

/** Re-usable type-safe role check for API routes (returns boolean instead of redirecting). */
export async function isAdmin(): Promise<boolean> {
  const session = await auth()
  const role = (session?.user as any)?.role as string | undefined
  return role === 'ADMIN'
}
