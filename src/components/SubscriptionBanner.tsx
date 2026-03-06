'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function SubscriptionBanner({
  status,
  expiresAt,
}: {
  status: string
  expiresAt?: Date | string | null
}) {
  // ── Hydration-safe date comparison ───────────────────────────────────────
  // `new Date()` on the server returns UTC; on the client it returns local
  // time. If we compute `effectiveActive` during SSR and the result differs
  // from the client's computation we get a React hydration mismatch.
  //
  // Strategy: default to NOT showing the banner during SSR (mounted = false),
  // then evaluate the real condition after mount. This way the server and
  // client both render null for the first paint, eliminating any mismatch.
  const [mounted, setMounted] = useState(false)
  const [effectiveActive, setEffectiveActive] = useState(false)

  useEffect(() => {
    const isActive =
      status === 'ACTIVE' ||
      (status === 'CANCELED' && expiresAt != null && new Date(expiresAt) > new Date())
    setEffectiveActive(isActive)
    setMounted(true)
  }, [status, expiresAt])

  // Before mount, render nothing — identical on server and client, no mismatch.
  if (!mounted) return null

  if (effectiveActive) return null

  const isTrial = status === 'TRIAL'

  return (
    <div className={`border-b px-4 py-3 flex items-center gap-3 ${
      isTrial
        ? 'bg-[#C0A4A3]/10 border-[#C0A4A3]/30'
        : 'bg-red-50 border-red-200'
    }`}>
      <span className="text-lg shrink-0">{isTrial ? '🔔' : '⚠️'}</span>

      <p className={`text-sm font-medium flex-1 ${isTrial ? 'text-gray-700' : 'text-red-800'}`}>
        {isTrial
          ? 'لن يظهر حسابك في نتائج البحث حتى يتم تفعيل الاشتراك.'
          : 'انتهى اشتراكك. حسابك غير مرئي للعملاء ولا يمكنك استقبال طلبات جديدة.'}
      </p>

      <Link
        href="/pricing"
        className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
          isTrial
            ? 'bg-[#C0A4A3] text-white hover:bg-[#A88887]'
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        فعّل الاشتراك
      </Link>
    </div>
  )
}
