'use client'

import { useState } from 'react'

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
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

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

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate())

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
          const isPast = new Date(dateStr) < today && dateStr !== todayStr

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
