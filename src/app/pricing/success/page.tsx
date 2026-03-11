'use client'

/**
 * /pricing/success
 *
 * FREE MODE: Platform is free — skip payment verification and redirect directly
 * to the photographer dashboard.
 *
 * Original polling/verification logic is preserved below in comments for
 * future use when payment gating is re-enabled.
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // FREE MODE: no payment to verify — go straight to dashboard
    router.replace('/photographer/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#C0A4A3] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

/*
 * ── ORIGINAL PAYMENT VERIFICATION CODE (kept for future use) ─────────────────
 *
 * To restore payment gating:
 *  1. Remove the component above.
 *  2. Uncomment and export OriginalSuccessPage below.
 *  3. Revert isEffectiveSubscriptionActive.ts to its original logic.
 *
 * import { useEffect, useState, useCallback, Suspense } from 'react'
 * import { useSearchParams, useRouter } from 'next/navigation'
 * import Link from 'next/link'
 *
 * const MOCK_SECRET = 'DEV_MOCK_SECRET'
 * const IS_DEV = process.env.NODE_ENV === 'development'
 * type Status = 'PENDING' | 'SUCCESS' | 'FAILED' | 'NOT_FOUND' | 'LOADING'
 *
 * function SuccessPageInner() {
 *   const searchParams = useSearchParams()
 *   const router = useRouter()
 *   const intentId = searchParams.get('intentId')
 *   const [status, setStatus] = useState<Status>('LOADING')
 *   ...polls /api/subscription/status every 2s...
 *   ...renders جارٍ التحقق من الدفع while PENDING...
 *   ...renders 🎉 and dashboard link on SUCCESS...
 * }
 *
 * export function OriginalSuccessPage() {
 *   return <Suspense fallback={...}><SuccessPageInner /></Suspense>
 * }
 */
