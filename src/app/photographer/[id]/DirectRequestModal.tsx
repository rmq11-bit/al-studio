'use client'

import { useState } from 'react'

export default function DirectRequestModal({
  photographerUserId,
  photographerName,
  isActive,
}: {
  photographerUserId: string
  photographerName: string
  isActive: boolean
}) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState('')
  const [hours, setHours] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!hours || parseFloat(hours) <= 0) return setError('عدد الساعات مطلوب')

    setLoading(true)
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photographerUserId,
          date: date || null,
          hours: parseFloat(hours),
          notes: notes || null,
        }),
      })
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          setOpen(false)
          setSuccess(false)
          setDate('')
          setHours('')
          setNotes('')
        }, 2000)
      } else {
        const d = await res.json()
        setError(d.error || 'حدث خطأ')
      }
    } catch {
      setError('حدث خطأ في الشبكة')
    }
    setLoading(false)
  }

  if (!isActive) {
    return (
      <button
        disabled
        title="المصور غير متاح للطلبات حالياً"
        className="bg-gray-200 text-gray-400 px-6 py-2.5 rounded-xl font-semibold text-sm cursor-not-allowed"
      >
        غير متاح للطلبات
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-[#C0A4A3] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#A88887] transition-colors"
      >
        طلب مباشر
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">طلب مباشر لـ {photographerName}</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            {success ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">✅</div>
                <p className="font-bold text-gray-800">تم إرسال طلبك بنجاح!</p>
                <p className="text-sm text-gray-500 mt-1">سيرد المصور قريباً</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    التاريخ المطلوب (اختياري)
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    عدد الساعات المطلوبة <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="مثال: 4"
                    min="1"
                    max="24"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    ملاحظات (اختياري)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="اكتب تفاصيل إضافية عن المناسبة أو الطلب..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C0A4A3] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#A88887] transition-colors disabled:opacity-60"
                >
                  {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
