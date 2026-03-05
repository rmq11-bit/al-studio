'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { SPECIALTY_LABELS } from '@/lib/specialties'

export default function BrowseFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [q, setQ] = useState(searchParams.get('q') ?? '')
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') ?? '')
  const [minRate, setMinRate] = useState(searchParams.get('minRate') ?? '')
  const [maxRate, setMaxRate] = useState(searchParams.get('maxRate') ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (specialty) params.set('specialty', specialty)
    if (minRate) params.set('minRate', minRate)
    if (maxRate) params.set('maxRate', maxRate)
    startTransition(() => {
      router.push(`/browse?${params.toString()}`)
    })
  }

  function handleReset() {
    setQ('')
    setSpecialty('')
    setMinRate('')
    setMaxRate('')
    startTransition(() => {
      router.push('/browse')
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            بحث بالاسم
          </label>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="اسم المصور..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            التخصص
          </label>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20 transition-all bg-white"
          >
            <option value="">كل التخصصات</option>
            {Object.entries(SPECIALTY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            أدنى سعر (ريال/ساعة)
          </label>
          <input
            type="number"
            value={minRate}
            onChange={(e) => setMinRate(e.target.value)}
            placeholder="0"
            min="0"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            أقصى سعر (ريال/ساعة)
          </label>
          <input
            type="number"
            value={maxRate}
            onChange={(e) => setMaxRate(e.target.value)}
            placeholder="لا حد"
            min="0"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20 transition-all"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#C0A4A3] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#A88887] transition-colors disabled:opacity-60"
        >
          {isPending ? 'جاري البحث...' : 'بحث'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          مسح الفلاتر
        </button>
      </div>
    </form>
  )
}
