'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  id: string
  body: string
  senderId: string
  createdAt: string
  sender: { name: string; avatarUrl?: string | null }
}

interface Props {
  conversationId: string
  currentUserId: string
  initialMessages: Message[]
}

export default function MessageThread({
  conversationId,
  currentUserId,
  initialMessages,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Poll for new messages every 5s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/conversations/${conversationId}/messages`)
        if (res.ok) {
          const data = await res.json()
          setMessages(data)
        }
      } catch {}
    }, 5000)
    return () => clearInterval(interval)
  }, [conversationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim() || sending) return
    setSending(true)
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: body.trim() }),
      })
      if (res.ok) {
        const msg = await res.json()
        setMessages((prev) => [...prev, msg])
        setBody('')
      }
    } catch {}
    setSending(false)
  }

  function formatTime(dateStr: string) {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <div className="text-4xl mb-2">💬</div>
            <p>لا توجد رسائل بعد. ابدأ المحادثة!</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUserId
          return (
            <div
              key={msg.id}
              className={`flex gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {msg.sender.avatarUrl ? (
                <img
                  src={msg.sender.avatarUrl}
                  alt={msg.sender.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#C0A4A3] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">
                  {msg.sender.name?.[0]}
                </div>
              )}
              <div className={`max-w-[70%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMine
                      ? 'bg-[#C0A4A3] text-white rounded-tl-none'
                      : 'bg-gray-100 text-gray-800 rounded-tr-none'
                  }`}
                >
                  {msg.body}
                </div>
                <span className="text-xs text-gray-400 px-1">{formatTime(msg.createdAt)}</span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="border-t border-gray-100 p-4 flex gap-3 bg-white"
      >
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="اكتب رسالتك..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20"
        />
        <button
          type="submit"
          disabled={!body.trim() || sending}
          className="bg-[#C0A4A3] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#A88887] transition-colors disabled:opacity-50"
        >
          إرسال
        </button>
      </form>
    </div>
  )
}
