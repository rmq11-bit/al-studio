'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  expiresAt: Date | string | null
}

export default function CancelSubscriptionButton({ expiresAt }: Props) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null)

  async function handleCancel() {
    setLoading(true)
    setToast(null)
    try {
      const res = await fetch('/api/subscription/cancel', { method: 'POST' })
      const data = await res.json()

      if (res.ok) {
        const until = data.subscriptionExpiresAt
          ? new Date(data.subscriptionExpiresAt).toLocaleDateString('ar-SA')
          : null
        setToast({
          ok: true,
          msg: until
            ? `تم إلغاء اشتراكك — يمكنك استخدام الميزات حتى تاريخ الانتهاء: ${until}.`
            : 'تم إلغاء الاشتراك.',
        })
        setShowConfirm(false)
        router.refresh()
      } else {
        setToast({ ok: false, msg: data.error ?? 'حدث خطأ. حاول مرة أخرى.' })
      }
    } catch {
      setToast({ ok: false, msg: 'تعذّر الاتصال بالخادم.' })
    } finally {
      setLoading(false)
    }
  }

  const expiryFormatted = expiresAt
    ? new Date(expiresAt).toLocaleDateString('ar-SA')
    : null

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      {/* Toast */}
      {toast && (
        <div
          className={`mb-3 text-xs font-medium px-3 py-2 rounded-lg ${
            toast.ok
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="text-xs text-gray-400 hover:text-red-500 font-medium underline underline-offset-2 transition-colors"
        >
          إلغاء الاشتراك
        </button>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm font-bold text-red-700 mb-1">تأكيد إلغاء الاشتراك</p>
          <p className="text-xs text-red-600 leading-relaxed mb-3">
            {expiryFormatted
              ? `سيتم إلغاء تجديد الاشتراك. يمكنك الاستمرار في استخدام جميع الميزات حتى ${expiryFormatted}.`
              : 'سيتم إلغاء اشتراكك فوراً. لن تتمكن من الظهور في البحث أو استقبال الطلبات.'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'جارٍ الإلغاء...' : 'نعم، إلغاء الاشتراك'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={loading}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-600 text-xs font-bold py-2 px-3 rounded-lg border border-gray-200 transition-colors disabled:opacity-60"
            >
              تراجع
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
