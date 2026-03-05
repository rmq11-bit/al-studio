/**
 * Subscription guard helpers for photographer-only API routes and pages.
 *
 * Usage in API routes (after confirming session.user.role === 'PHOTOGRAPHER'):
 *   const guard = await assertActivePhotographer(session.user.id)
 *   if (guard) return guard   // returns 402 immediately
 *
 * Usage in server components / pages:
 *   const sub = await getPhotographerSubscription(userId)
 *   if (!sub?.isActive) redirect('/pricing?reason=required')
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isEffectiveSubscriptionActive } from './isEffectiveSubscriptionActive'

export interface PhotographerSubscription {
  profileId: string
  status: string
  expiresAt: Date | null
  canceledAt: Date | null
  /**
   * True when the photographer has usable access:
   *   - ACTIVE (and expiry null or future)
   *   - CANCELED (but expiresAt is still in the future — access until end of billing period)
   */
  isActive: boolean
}

/**
 * Fetches and resolves the effective subscription status for a photographer.
 * Returns null if the user has no photographer profile.
 */
export async function getPhotographerSubscription(
  userId: string,
): Promise<PhotographerSubscription | null> {
  const profile = await prisma.photographerProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      subscriptionStatus: true,
      subscriptionExpiresAt: true,
      subscriptionCanceledAt: true,
    },
  })

  if (!profile) return null

  // Delegate to the single source of truth for access logic
  const isActive = isEffectiveSubscriptionActive(
    profile.subscriptionStatus,
    profile.subscriptionExpiresAt,
  )

  return {
    profileId: profile.id,
    status: profile.subscriptionStatus,
    expiresAt: profile.subscriptionExpiresAt,
    canceledAt: profile.subscriptionCanceledAt,
    isActive,
  }
}

/**
 * Asserts the photographer has an active subscription.
 * Returns a 402 NextResponse if not active, or null if active (proceed normally).
 *
 * Pattern:
 *   const guard = await assertActivePhotographer(session.user.id)
 *   if (guard) return guard
 */
export async function assertActivePhotographer(
  userId: string,
): Promise<NextResponse | null> {
  const sub = await getPhotographerSubscription(userId)

  if (!sub || !sub.isActive) {
    return NextResponse.json(
      {
        error: 'يجب أن يكون لديك اشتراك نشط للقيام بهذا الإجراء',
        code: 'SUBSCRIPTION_REQUIRED',
      },
      { status: 402 },
    )
  }

  return null // active — caller may proceed
}
