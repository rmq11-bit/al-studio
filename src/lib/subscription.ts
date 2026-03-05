import { prisma } from '@/lib/prisma'
import { isEffectiveSubscriptionActive as _isEffective } from './subscription/isEffectiveSubscriptionActive'

export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'CANCELLED'

export const SUBSCRIPTION_LABELS: Record<string, string> = {
  TRIAL: 'فترة تجريبية',
  ACTIVE: 'اشتراك نشط',
  CANCELED: 'ملغي (نشط حتى نهاية الدورة)',
  PAST_DUE: 'منتهي الصلاحية',
  CANCELLED: 'ملغي',
}

export const SUBSCRIPTION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  TRIAL: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  ACTIVE: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  CANCELED: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  PAST_DUE: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  CANCELLED: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
}

/** @deprecated Use isEffectiveSubscriptionActive from lib/subscription/isEffectiveSubscriptionActive instead */
export function isSubscriptionActive(status: string, expiresAt?: Date | null): boolean {
  return _isEffective(status, expiresAt)
}

/**
 * Check if a TRIAL subscription has expired and update it to PAST_DUE if so.
 * Returns the effective (possibly updated) status.
 */
export async function checkAndExpireTrial(
  profileId: string,
  currentStatus: string,
  trialEndsAt: Date | null
): Promise<string> {
  if (currentStatus === 'TRIAL' && trialEndsAt && new Date() > trialEndsAt) {
    await prisma.photographerProfile.update({
      where: { id: profileId },
      data: { subscriptionStatus: 'PAST_DUE' },
    })
    return 'PAST_DUE'
  }
  return currentStatus
}
