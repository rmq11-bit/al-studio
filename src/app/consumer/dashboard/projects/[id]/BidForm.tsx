'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BidForm({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [price, setPrice] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!price || parseFloat(price) <= 0)
      return setError('السعر المقترح للمشروع مطلوب ويجب أن يكون أكبر من صفر')

    setLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: parseFloat(price),
          message: message.trim() || null,
        }),
      })
      if (res.ok) {
        router.refresh()
      } else {
        const d = await res.json()
        setError(d.error || 'حدث خطأ')
      }
    } catch {
      setError('حدث خطأ في الشبكة')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          السعر المقترح للمشروع (ريال) <span className="text-red-400">*</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="مثال: 2500"
            min="1"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20 transition-all"
            required
          />
          <span className="text-sm text-gray-500 shrink-0">ريال سعودي</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          رسالة للعميل (اختياري)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب لماذا أنت المصور المناسب لهذا المشروع..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20 transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#C0A4A3] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#A88887] transition-colors disabled:opacity-60"
      >
        {loading ? 'جاري الإرسال...' : 'تقديم العرض'}
      </button>
    </form>
  )
}
