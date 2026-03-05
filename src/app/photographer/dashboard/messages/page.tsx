'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MessageThread from '@/components/MessageThread'

interface Conversation {
  id: string
  consumer: { id: string; name: string; avatarUrl?: string | null }
  messages: { id: string; body: string; createdAt: string }[]
  createdAt: string
}

export default function PhotographerMessagesPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [myId, setMyId] = useState<string>('')

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((d) => setMyId(d.id))
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch('/api/conversations')
      .then((r) => r.json())
      .then((d) => { setConversations(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function loadMessages(convId: string) {
    setSelected(convId)
    const res = await fetch(`/api/conversations/${convId}/messages`)
    if (res.ok) {
      const data = await res.json()
      setMessages(data)
    }
  }

  const selectedConv = conversations.find((c) => c.id === selected)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">الرسائل</h1>

      <div className="flex gap-4 h-[calc(100vh-16rem)] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Conversations list */}
        <div className="w-72 shrink-0 border-l border-gray-100 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-sm">لا توجد محادثات بعد</p>
            </div>
          ) : (
            <div className="p-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => loadMessages(conv.id)}
                  className={`w-full text-right p-3 rounded-xl flex items-center gap-3 transition-all ${
                    selected === conv.id ? 'bg-[#C0A4A3]/10' : 'hover:bg-gray-50'
                  }`}
                >
                  {conv.consumer.avatarUrl ? (
                    <img src={conv.consumer.avatarUrl} alt={conv.consumer.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[#C0A4A3] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {conv.consumer.name[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">{conv.consumer.name}</p>
                    {conv.messages[0] && (
                      <p className="text-xs text-gray-400 truncate">{conv.messages[0].body}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message thread */}
        <div className="flex-1 min-w-0">
          {selected && myId ? (
            <MessageThread
              conversationId={selected}
              currentUserId={myId}
              initialMessages={messages}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-5xl mb-3">💬</div>
                <p>اختر محادثة للبدء</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
