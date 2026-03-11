/**
 * Single source of truth for subscription access logic.
 *
 * effectiveActive =
 *   subscriptionStatus === 'ACTIVE'
 *   OR (subscriptionStatus === 'CANCELED' AND expiresAt != null AND expiresAt > now)
 *
 * Import and use these helpers everywhere instead of comparing
 * subscriptionStatus === 'ACTIVE' directly.
 */

export type EffectiveSubscriptionStatus =
  | 'ACTIVE_FULL'           // Paid, non-canceled subscription
  | 'ACTIVE_UNTIL_EXPIRY'   // Canceled but still within paid billing period
  | 'INACTIVE'              // TRIAL, PAST_DUE, CANCELED+expired, or no profile

/**
 * Returns true when the photographer has effective access to all paid features.
 *
 * Covers both fully-active (ACTIVE) and canceled-but-not-yet-expired (CANCELED)
 * photographers so that cancellation doesn't revoke access until the billing period ends.
 *
 * FREE MODE: Platform is free for all users — always returns true.
 * To re-enable payment gating, remove the early return below.
 */
export function isEffectiveSubscriptionActive(
  status: string,
  expiresAt: Date | string | null | undefined,
): boolean {
  // FREE MODE — bypass all subscription checks
  return true

  // Original payment logic (kept for future use):
  // if (status === 'ACTIVE') return true
  // if (
  //   status === 'CANCELED' &&
  //   expiresAt != null &&
  //   new Date(expiresAt) > new Date()
  // )
  //   return true
  // return false
}

/**
 * Returns a fine-grained status for UI rendering decisions.
 *
 * Usage example:
 *   const s = getEffectiveSubscriptionStatus(status, expiresAt)
 *   if (s === 'ACTIVE_UNTIL_EXPIRY') showOrangeBanner()
 */
export function getEffectiveSubscriptionStatus(
  status: string,
  expiresAt: Date | string | null | undefined,
): EffectiveSubscriptionStatus {
  // FREE MODE — all users treated as fully active
  return 'ACTIVE_FULL'

  // Original logic (kept for future use):
  // if (status === 'ACTIVE') return 'ACTIVE_FULL'
  // if (
  //   status === 'CANCELED' &&
  //   expiresAt != null &&
  //   new Date(expiresAt) > new Date()
  // )
  //   return 'ACTIVE_UNTIL_EXPIRY'
  // return 'INACTIVE'
}

/**
 * Builds a Prisma `where` sub-object that matches all effectively-active
 * photographer profiles (ACTIVE OR CANCELED-but-not-expired).
 *
 * Merge with other filters using object spread:
 *   const where = { ...effectiveSubscriptionWhere(), hourlyRate: { gte: 100 } }
 *
 * Or use directly:
 *   prisma.photographerProfile.count({ where: effectiveSubscriptionWhere() })
 */
export function effectiveSubscriptionWhere() {
  // FREE MODE — match all photographers regardless of subscription status
  return {}

  // Original logic (kept for future use):
  // const now = new Date()
  // return {
  //   OR: [
  //     { subscriptionStatus: 'ACTIVE' },
  //     {
  //       subscriptionStatus: 'CANCELED',
  //       subscriptionExpiresAt: { gt: now },
  //     },
  //   ],
  // }
}
