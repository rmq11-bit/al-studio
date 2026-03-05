'use client'

/**
 * /pricing/success
 *
 * Landing page after payment redirect.
 * Reads intentId from the URL query string, then polls /api/subscription/status
 * every 2 seconds until the status changes from PENDING to SUCCESS or FAILED.
 *
 * DEV button (NODE_ENV === "development" only):
 *   Sends a mock webhook to /api/subscription/webhook to simulate payment confirmation.
 *   Hidden in production builds.
 */

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

// DEV-only mock webhook secret — must match MOCK_WEBHOOK_SECRET env var (default "DEV_MOCK_SECRET")
const MOCK_SECRET = 'DEV_MOCK_SECRET'
const IS_DEV = process.env.NODE_ENV === 'development'

type Status = 'PENDING' | 'SUCCESS' | 'FAILED' | 'NOT_FOUND' | 'LOADING'

function SuccessPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const intentId = searchParams.get('intentId')

  const [status, setStatus] = useState<Status>('LOADING')
  const [devLoading, setDevLoading] = useState(false)
  const [devError, setDevError] = useState<string | null>(null)

  // ── Poll /api/payments/status every 2 s ────────────────────────────────────
  const pollStatus = useCallback(async () => {
    if (!intentId) {
      setStatus('NOT_FOUND')
      return
    }
    try {
      const res = await fetch(`/api/subscription/status?intentId=${intentId}`)
      if (res.status === 404) { setStatus('NOT_FOUND'); return }
      if (res.status === 401) { router.push('/auth/login'); return }
      const data = await res.json()
      setStatus(data.status as Status)
    } catch {
      // Network error — keep polling
    }
  }, [intentId, router])

  useEffect(() => {
    pollStatus()
    const interval = setInterval(pollStatus, 2000)
    return () => clearInterval(interval)
  }, [pollStatus])

  // ── DEV: trigger mock webhook to confirm payment ────────────────────────────
  async function triggerMockWebhook() {
    if (!intentId) return
    setDevLoading(true)
    setDevError(null)
    try {
      const res = await fetch('/api/subscription/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intentId, mockSecret: MOCK_SECRET, status: 'SUCCESS' }),
      })
      const data = await res.json()
      if (!res.ok) {
        setDevError(data.error ?? 'فشل تأكيد الدفع التجريبي')
      }
      // Status will update on next poll cycle
    } catch {
      setDevError('تعذّر الاتصال بالخادم')
    } finally {
      setDevLoading(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  if (!intentId || status === 'NOT_FOUND') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">❓</div>
          <h1 className="text-xl font-black text-gray-800 mb-2">رابط غير صالح</h1>
          <p className="text-gray-500 text-sm mb-6">لم يتم العثور على معرّف الدفع.</p>
          <Link href="/pricing" className="bg-[#C0A4A3] text-white px-8 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#A88887] transition-colors">
            العودة للأسعار
          </Link>
        </div>
      </div>
    )
  }

  if (status === 'SUCCESS') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-black text-gray-800 mb-2">اشتراكك الآن نشط!</h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            تم تفعيل اشتراكك بنجاح. يمكنك الآن الظهور في نتائج البحث واستقبال الطلبات.
          </p>
          <Link
            href="/photographer/dashboard"
            className="block w-full bg-[#C0A4A3] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#A88887] transition-colors"
          >
            انتقل إلى لوحة التحكم
          </Link>
        </div>
      </div>
    )
  }

  if (status === 'FAILED') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-xl font-black text-gray-800 mb-2">فشلت عملية الدفع</h1>
          <p className="text-gray-500 text-sm mb-6">لم تتم عملية الدفع. يمكنك المحاولة مرة أخرى.</p>
          <Link href="/pricing" className="bg-[#C0A4A3] text-white px-8 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#A88887] transition-colors">
            حاول مرة أخرى
          </Link>
        </div>
      </div>
    )
  }

  // LOADING / PENDING
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-sm w-full text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h1 className="text-xl font-black text-gray-800 mb-2">جارٍ التحقق من الدفع</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          نتحقق من حالة عملية الدفع. يرجى الانتظار…
        </p>

        {/* Animated spinner */}
        <div className="flex justify-center mb-8">
          <div className="w-8 h-8 border-4 border-[#C0A4A3] border-t-transparent rounded-full animate-spin" />
        </div>

        {/* DEV-only confirmation button — stripped from production builds */}
        {IS_DEV && (
          <div className="border-t border-dashed border-gray-200 pt-6">
            <p className="text-xs text-gray-400 mb-3 font-mono">DEV MODE</p>
            <button
              onClick={triggerMockWebhook}
              disabled={devLoading}
              className="w-full bg-amber-500 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors disabled:opacity-60"
            >
              {devLoading ? 'جارٍ التأكيد...' : '✓ تأكيد الدفع (DEV)'}
            </button>
            {devError && (
              <p className="text-xs text-red-500 mt-2">{devError}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              هذا الزر يحاكي استلام تأكيد الدفع من مزوّد الدفع
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Wrap in Suspense because useSearchParams requires it in Next.js App Router
export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C0A4A3] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessPageInner />
    </Suspense>
  )
}
