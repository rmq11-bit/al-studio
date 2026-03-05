'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  photographerId: string
}

export default function DevSubscriptionSimulator({ photographerId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)

  async function simulate() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/subscription/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photographerId,
          status: 'SUCCESS',
          amount: 4900,
          provider: 'DEV_SIMULATION',
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult({
          ok: true,
          msg: `✅ تم التفعيل — ينتهي في: ${new Date(data.subscriptionExpiresAt).toLocaleDateString('ar-SA')}`,
        })
        router.refresh()
      } else {
        setResult({ ok: false, msg: `❌ ${data.error ?? 'فشل الطلب'}` })
      }
    } catch {
      setResult({ ok: false, msg: '❌ خطأ في الاتصال بالخادم' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-dashed border-amber-300">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-black tracking-widest uppercase bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded">
          DEV
        </span>
        <span className="text-xs text-amber-700 font-medium">بيئة التطوير فقط</span>
      </div>
      <button
        onClick={simulate}
        disabled={loading}
        className="w-full border border-dashed border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '⏳ جارٍ المحاكاة...' : '⚡ محاكاة تفعيل الاشتراك (DEV)'}
      </button>
      {result && (
        <p className={`text-xs mt-2 font-medium text-center ${result.ok ? 'text-green-700' : 'text-red-600'}`}>
          {result.msg}
        </p>
      )}
    </div>
  )
}
