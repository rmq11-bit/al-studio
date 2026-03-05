'use client'

import Link from 'next/link'

export default function SubscriptionBanner({
  status,
  expiresAt,
}: {
  status: string
  expiresAt?: Date | string | null
}) {
  // Hide banner when the photographer has effective access:
  //   ACTIVE always has access
  //   CANCELED has access until subscriptionExpiresAt (if it's still in the future)
  const effectiveActive =
    status === 'ACTIVE' ||
    (status === 'CANCELED' && expiresAt != null && new Date(expiresAt) > new Date())

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
