'use client'

import { useState, useEffect } from 'react'

interface Props {
  availability: { date: string; status: string }[]
  editable?: boolean
  onToggle?: (date: string) => void
}

const DAYS_AR = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
]

export default function CalendarView({ availability, editable = false, onToggle }: Props) {
  // ── Hydration-safe date handling ─────────────────────────────────────────
  // `new Date()` on the Vercel server returns UTC time; on the browser it
  // returns the user's LOCAL time. In non-UTC timezones these can differ by
  // a full day, causing React hydration mismatches and a client-side crash.
  //
  // Solution: keep `mounted = false` during SSR so we render a neutral
  // placeholder that is identical on server and client. After the first
  // browser paint (useEffect), we set real local-time values and show the
  // full calendar — with zero hydration conflict.
  const [mounted, setMounted] = useState(false)
  const [todayStr, setTodayStr] = useState('')
  const [currentMonth, setCurrentMonth] = useState(0)
  const [currentYear, setCurrentYear] = useState(2024)

  useEffect(() => {
    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()
    const day = now.getDate()
    setCurrentMonth(month)
    setCurrentYear(year)
    setTodayStr(
      `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    )
    setMounted(true)
  }, [])

  // ─────────────────────────────────────────────────────────────────────────

  const availMap = new Map(availability.map((a) => [a.date, a.status]))

  function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate()
  }

  function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay()
  }

  function formatDate(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  // Render a neutral loading skeleton until the client has mounted.
  // This skeleton is identical on server and client, so React hydration
  // never sees a mismatch.
  if (!mounted) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm animate-pulse h-64" />
    )
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        >
          ▶
        </button>
        <span className="font-bold text-gray-800">
          {MONTHS_AR[currentMonth]} {currentYear}
        </span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        >
          ◀
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_AR.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />

          const dateStr = formatDate(currentYear, currentMonth, day)
          const status = availMap.get(dateStr)
          const isAvailable = status === 'AVAILABLE'
          const isToday = dateStr === todayStr
          // todayStr is guaranteed to be the real local date (set in useEffect),
          // so this comparison is always correct after mount.
          const isPast = todayStr !== '' && dateStr < todayStr

          return (
            <button
              key={dateStr}
              onClick={() => editable && onToggle && onToggle(dateStr)}
              disabled={!editable || isPast}
              title={isAvailable ? 'متاح' : status === 'UNAVAILABLE' ? 'غير متاح' : 'اضغط للتبديل'}
              className={[
                'aspect-square flex items-center justify-center text-xs rounded-lg transition-all',
                isToday ? 'ring-2 ring-[#C0A4A3] ring-offset-1' : '',
                isPast ? 'text-gray-300 cursor-not-allowed' : '',
                isAvailable
                  ? 'bg-[#C0A4A3] text-white font-semibold hover:bg-[#A88887]'
                  : status === 'UNAVAILABLE'
                  ? 'bg-gray-200 text-gray-400'
                  : editable
                  ? 'hover:bg-[#C0A4A3]/10 text-gray-600 cursor-pointer'
                  : 'text-gray-600',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#C0A4A3] inline-block" />
          متاح
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" />
          غير متاح
        </span>
        {editable && (
          <span className="flex items-center gap-1.5 text-[#C0A4A3] font-medium">
            اضغط على اليوم لتغيير حالته
          </span>
        )}
      </div>
    </div>
  )
}
