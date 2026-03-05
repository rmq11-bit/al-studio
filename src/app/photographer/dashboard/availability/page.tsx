'use client'

import { useState, useEffect } from 'react'
import CalendarView from '@/components/CalendarView'

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<{ date: string; status: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((d) => {
        // Profile doesn't include availability, need separate fetch
        setLoading(false)
      })

    fetch('/api/my-availability')
      .then((r) => r.json())
      .then((data) => {
        setAvailability(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function handleToggle(date: string) {
    setToggling(date)
    try {
      const res = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      })
      if (res.ok) {
        const updated = await res.json()
        setAvailability((prev) => {
          const existing = prev.find((a) => a.date === date)
          if (existing) {
            return prev.map((a) => (a.date === date ? { ...a, status: updated.status } : a))
          } else {
            return [...prev, { date: updated.date, status: updated.status }]
          }
        })
      }
    } catch {}
    setToggling(null)
  }

  const availableCount = availability.filter((a) => a.status === 'AVAILABLE').length

  return (
    <div className="max-w-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة التقويم</h1>
          <p className="text-sm text-gray-400 mt-1">اضغط على أي يوم لتغيير حالة توفرك</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black text-[#C0A4A3]">{availableCount}</div>
          <div className="text-xs text-gray-400">يوم متاح</div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 h-64 animate-pulse" />
      ) : (
        <CalendarView
          availability={availability}
          editable
          onToggle={handleToggle}
        />
      )}

      <div className="mt-4 bg-blue-50 rounded-xl p-4 text-sm text-blue-600 border border-blue-100">
        <p className="font-semibold mb-1">💡 نصيحة</p>
        <p>تأكد من تحديث تقويم توفرك بانتظام حتى يرى العملاء أيامك المتاحة عند زيارة ملفك الشخصي.</p>
      </div>
    </div>
  )
}
