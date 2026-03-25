'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

/**
 * Server Action for credentials login.
 *
 * Uses the server-side signIn from @/auth (not next-auth/react) so that
 * session cookies are written via next/headers cookies() — which is
 * guaranteed to reach the browser. The client-side signIn from next-auth/react
 * relies on Set-Cookie headers forwarded through the Route Handler pipeline,
 * which Next.js App Router silently drops in production.
 */
export async function loginAction(
  email: string,
  password: string
): Promise<{ error?: string }> {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    return {}
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'invalid-credentials' }
    }
    // Re-throw unexpected errors (e.g. DB connection failures)
    throw error
  }
}
