'use client'

/**
 * SubscriptionBanner — FREE MODE: always returns null.
 *
 * Platform is currently free for all users. This banner (which previously
 * prompted users to subscribe when on TRIAL or expired) is fully suppressed.
 * The original render logic is preserved below in comments for future use.
 */

export default function SubscriptionBanner({
  status: _status,
  expiresAt: _expiresAt,
}: {
  status: string
  expiresAt?: Date | string | null
}) {
  // FREE MODE: never show any subscription/payment prompt
  return null
}

/*
 * ── ORIGINAL BANNER CODE (kept for future use) ───────────────────────────────
 *
 * import Link from 'next/link'
 * import { useState, useEffect } from 'react'
 *
 * Shows a warning strip when the photographer's subscription is TRIAL or expired.
 * Renders nothing when status is ACTIVE or CANCELED-within-billing-period.
 *
 * Logic:
 *   useEffect: isActive = status === 'ACTIVE' || (CANCELED && expiresAt > now)
 *   if (!mounted || effectiveActive) return null
 *   Otherwise renders colored banner + link to /pricing + "فعّل الاشتراك" button
 */
