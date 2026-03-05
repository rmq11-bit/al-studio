'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewProjectPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [hours, setHours] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!title.trim()) return setError('عنوان المشروع مطلوب')
    if (!description.trim()) return setError('وصف المشروع مطلوب')
    if (!hours || parseFloat(hours) <= 0) return setError('عدد الساعات يجب أن يكون أكبر من صفر')

    setLoading(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          hours: parseFloat(hours),
        }),
      })
      if (res.ok) {
        const project = await res.json()
        router.push(`/consumer/dashboard/projects/${project.id}`)
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
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/consumer/dashboard/projects" className="text-gray-400 hover:text-gray-600 transition-colors">
          ← العودة
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">نشر مشروع جديد</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm text-gray-500 mb-6 bg-[#C0A4A3]/5 border border-[#C0A4A3]/20 rounded-xl p-3">
          💡 كلما كانت تفاصيل مشروعك واضحة، كلما جذبت عروضاً أفضل من المصورين المناسبين لك.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              عنوان للمشروع <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: تصوير حفل زفاف فاخر في الرياض"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20 transition-all"
              maxLength={100}
            />
            <p className="text-xs text-gray-400 mt-1 text-left">{title.length}/100</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              شرح للمشروع واحتياجاته <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اشرح بالتفصيل ما تحتاجه: نوع المناسبة، المكان، عدد الأشخاص، نوع الصور المطلوبة، أي تفاصيل خاصة..."
              rows={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              عدد ساعات التصوير <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="مثال: 6"
                min="1"
                max="48"
                className="w-32 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20 transition-all"
              />
              <span className="text-sm text-gray-500">ساعة</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#C0A4A3] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#A88887] transition-colors disabled:opacity-60"
            >
              {loading ? 'جاري النشر...' : 'نشر المشروع'}
            </button>
            <Link
              href="/consumer/dashboard/projects"
              className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors text-center"
            >
              إلغاء
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
