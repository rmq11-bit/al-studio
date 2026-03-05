'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CloseProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClose() {
    if (!confirm('هل أنت متأكد من إغلاق هذا المشروع؟ لن تتلقى عروضاً جديدة بعد إغلاقه.')) return
    setLoading(true)
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CLOSED' }),
      })
      router.refresh()
    } catch {}
    setLoading(false)
  }

  return (
    <button
      onClick={handleClose}
      disabled={loading}
      className="border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-60 shrink-0"
    >
      {loading ? 'جاري...' : 'إغلاق المشروع'}
    </button>
  )
}
