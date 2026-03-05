'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ConversationButton({
  photographerUserId,
}: {
  photographerUserId: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photographerUserId }),
      })
      if (res.ok) {
        const conv = await res.json()
        router.push(`/consumer/dashboard/messages/${conv.id}`)
      }
    } catch {}
    setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="border-2 border-[#C0A4A3] text-[#C0A4A3] px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#C0A4A3] hover:text-white transition-all disabled:opacity-60"
    >
      {loading ? 'جاري الفتح...' : 'محادثة'}
    </button>
  )
}
