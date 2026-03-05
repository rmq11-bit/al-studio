'use client'

import { useState, useEffect } from 'react'

interface DirectRequest {
  id: string
  consumerId: string
  date?: string | null
  hours: number
  notes?: string | null
  status: string
  rejectionNote?: string | null
  createdAt: string
  consumer: { id: string; name: string; avatarUrl?: string | null }
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'معلق', color: 'bg-amber-100 text-amber-700' },
  APPROVED: { label: 'موافق', color: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'مرفوض', color: 'bg-red-100 text-red-600' },
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<DirectRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)
  const [rejectionNote, setRejectionNote] = useState('')
  const [rejectingId, setRejectingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/requests')
      .then((r) => r.json())
      .then((d) => { setRequests(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function updateStatus(id: string, status: 'APPROVED' | 'REJECTED', note?: string) {
    setActionId(id)
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionNote: note ?? null }),
      })
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, status, rejectionNote: note ?? null } : r
          )
        )
        setRejectingId(null)
        setRejectionNote('')
      }
    } catch {}
    setActionId(null)
  }

  const pending = requests.filter((r) => r.status === 'PENDING')
  const others = requests.filter((r) => r.status !== 'PENDING')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">الطلبات المباشرة</h1>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">📩</div>
          <p className="text-lg font-medium">لا توجد طلبات بعد</p>
          <p className="text-sm mt-1">ستظهر هنا عندما يرسل إليك العملاء طلبات مباشرة</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.length > 0 && (
            <div>
              <h2 className="font-bold text-amber-600 text-sm mb-3">⏳ تنتظر ردك ({pending.length})</h2>
              <div className="space-y-3">
                {pending.map((req) => (
                  <RequestCard
                    key={req.id}
                    req={req}
                    actionId={actionId}
                    rejectingId={rejectingId}
                    rejectionNote={rejectionNote}
                    setRejectingId={setRejectingId}
                    setRejectionNote={setRejectionNote}
                    onApprove={() => updateStatus(req.id, 'APPROVED')}
                    onReject={(note) => updateStatus(req.id, 'REJECTED', note)}
                  />
                ))}
              </div>
            </div>
          )}

          {others.length > 0 && (
            <div>
              <h2 className="font-bold text-gray-500 text-sm mb-3">السابقة ({others.length})</h2>
              <div className="space-y-3">
                {others.map((req) => (
                  <RequestCard
                    key={req.id}
                    req={req}
                    actionId={actionId}
                    rejectingId={rejectingId}
                    rejectionNote={rejectionNote}
                    setRejectingId={setRejectingId}
                    setRejectionNote={setRejectionNote}
                    onApprove={() => {}}
                    onReject={() => {}}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RequestCard({
  req,
  actionId,
  rejectingId,
  rejectionNote,
  setRejectingId,
  setRejectionNote,
  onApprove,
  onReject,
}: {
  req: DirectRequest
  actionId: string | null
  rejectingId: string | null
  rejectionNote: string
  setRejectingId: (id: string | null) => void
  setRejectionNote: (note: string) => void
  onApprove: () => void
  onReject: (note: string) => void
}) {
  const statusInfo = STATUS_LABELS[req.status] ?? { label: req.status, color: 'bg-gray-100 text-gray-600' }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start gap-4">
        {req.consumer.avatarUrl ? (
          <img src={req.consumer.avatarUrl} alt={req.consumer.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
        ) : (
          <div className="w-11 h-11 rounded-xl bg-[#C0A4A3] flex items-center justify-center text-white font-bold shrink-0">
            {req.consumer.name[0]}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="font-bold text-gray-800">{req.consumer.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
            <span>⏱️ {req.hours} ساعة</span>
            {req.date && <span>📅 {req.date}</span>}
          </div>

          {req.notes && (
            <p className="text-sm text-gray-500 bg-gray-50 rounded-xl px-3 py-2 mb-3">{req.notes}</p>
          )}

          {req.rejectionNote && (
            <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2 mb-3">
              سبب الرفض: {req.rejectionNote}
            </p>
          )}

          {req.status === 'PENDING' && (
            <div>
              {rejectingId === req.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={rejectionNote}
                    onChange={(e) => setRejectionNote(e.target.value)}
                    placeholder="سبب الرفض (اختياري)"
                    className="w-full border border-red-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => onReject(rejectionNote)}
                      disabled={actionId === req.id}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-600 transition-colors"
                    >
                      تأكيد الرفض
                    </button>
                    <button
                      onClick={() => { setRejectingId(null); setRejectionNote('') }}
                      className="border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-xs font-semibold"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={onApprove}
                    disabled={actionId === req.id}
                    className="bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-green-600 transition-colors disabled:opacity-60"
                  >
                    {actionId === req.id ? '...' : '✓ قبول'}
                  </button>
                  <button
                    onClick={() => setRejectingId(req.id)}
                    disabled={actionId === req.id}
                    className="bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors"
                  >
                    ✕ رفض
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
