'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// ─── Types ──────────────────────────────────────────────────────────────────

interface OtherParty {
  id: string
  name: string
  avatarUrl: string | null
}

interface ConversationSummary {
  id: string
  type: string
  projectId: string | null
  directRequestId: string | null
  otherParty: OtherParty
  lastMessage: { body: string; createdAt: string } | null
  unreadCount: number
  updatedAt: string
}

interface MessageItem {
  id: string
  conversationId: string
  senderId: string
  senderRole: string
  body: string
  createdAt: string
  readAt: string | null
  sender: { id: string; name: string; avatarUrl: string | null }
}

interface Props {
  currentUserId: string
  initialConversationId?: string
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function Avatar({ name, avatarUrl, size = 10 }: { name: string; avatarUrl: string | null; size?: number }) {
  const cls = `w-${size} h-${size} rounded-full object-cover shrink-0`
  if (avatarUrl)
    return <img src={avatarUrl} alt={name} className={cls} />
  return (
    <div
      className={`w-${size} h-${size} rounded-full bg-[#C0A4A3]/20 flex items-center justify-center text-[#C0A4A3] font-bold shrink-0`}
      style={{ fontSize: size * 1.4 }}
    >
      {name[0]}
    </div>
  )
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
}

function formatPreviewDate(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return formatTime(iso)
  if (d.toDateString() === yesterday.toDateString()) return 'أمس'
  return d.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function MessagingInbox({ currentUserId, initialConversationId }: Props) {
  const router = useRouter()

  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const selectedConv = conversations.find((c) => c.id === selectedId) ?? null

  // ── Data fetchers ────────────────────────────────────────────────────────

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/messages/conversations')
      if (res.ok) setConversations(await res.json())
    } catch {}
  }, [])

  const fetchMessages = useCallback(async (convId: string, silent = false) => {
    if (!silent) setLoadingMsgs(true)
    try {
      const res = await fetch(`/api/messages/conversation/${convId}`)
      if (res.ok) setMessages(await res.json())
    } catch {} finally {
      if (!silent) setLoadingMsgs(false)
    }
  }, [])

  const markRead = useCallback(async (convId: string) => {
    try {
      await fetch('/api/messages/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: convId }),
      })
      setConversations((prev) => prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c)))
    } catch {}
  }, [])

  // ── Select a conversation ────────────────────────────────────────────────

  const openConversation = useCallback(
    async (convId: string) => {
      if (convId === selectedId) return
      setSelectedId(convId)
      setMessages([])
      await fetchMessages(convId)
      markRead(convId)
      router.replace(`/messages/${convId}`, { scroll: false })
    },
    [selectedId, fetchMessages, markRead, router]
  )

  // ── Initial load ─────────────────────────────────────────────────────────

  useEffect(() => {
    async function init() {
      await fetchConversations()
      setLoadingConvs(false)
      if (initialConversationId) {
        setSelectedId(initialConversationId)
        await fetchMessages(initialConversationId)
        markRead(initialConversationId)
      }
    }
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Polling: refresh messages + conversations every 4 s ──────────────────

  useEffect(() => {
    if (!selectedId) return
    pollRef.current = setInterval(async () => {
      await fetchMessages(selectedId, true)
      await fetchConversations()
    }, 4000)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-scroll to bottom ────────────────────────────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Send message ─────────────────────────────────────────────────────────

  async function sendMessage() {
    if (!selectedId || !body.trim() || sending) return
    const trimmedBody = body.trim()
    setBody('')
    setSending(true)

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    // Optimistic append
    const optimistic: MessageItem = {
      id: `opt-${Date.now()}`,
      conversationId: selectedId,
      senderId: currentUserId,
      senderRole: 'CLIENT',
      body: trimmedBody,
      createdAt: new Date().toISOString(),
      readAt: null,
      sender: { id: currentUserId, name: 'أنت', avatarUrl: null },
    }
    setMessages((prev) => [...prev, optimistic])

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selectedId, body: trimmedBody }),
      })

      if (res.ok) {
        const newMsg: MessageItem = await res.json()
        setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? newMsg : m)))
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedId
              ? { ...c, lastMessage: { body: trimmedBody, createdAt: newMsg.createdAt } }
              : c
          )
        )
      } else {
        // Rollback optimistic on failure
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id))
        setBody(trimmedBody)
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id))
      setBody(trimmedBody)
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* ── RIGHT panel: Conversation list ─────────────────────────────────── */}
      {/* In RTL flex-row, first child = right side */}
      <aside className="w-80 bg-white border-l border-gray-100 flex flex-col shrink-0 shadow-sm">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <h1 className="text-lg font-black text-gray-800">💬 الرسائل</h1>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="p-6 text-center text-gray-400 text-sm">جارٍ التحميل…</div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3 opacity-40">📭</div>
              <p className="text-gray-500 text-sm font-medium">لا توجد محادثات</p>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                أرسل طلباً مباشراً أو تقدّم بعرض على مشروع لفتح محادثة
              </p>
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = selectedId === conv.id
              const hasUnread = conv.unreadCount > 0
              return (
                <button
                  key={conv.id}
                  onClick={() => openConversation(conv.id)}
                  className={`w-full text-right px-4 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-stretch gap-0 ${
                    isActive ? 'bg-[#C0A4A3]/8' : ''
                  }`}
                >
                  {/* Active bar */}
                  <div
                    className={`w-0.5 rounded-full me-3 shrink-0 self-stretch ${isActive ? 'bg-[#C0A4A3]' : 'bg-transparent'}`}
                  />

                  {/* Avatar */}
                  <div className="shrink-0 me-3">
                    {conv.otherParty.avatarUrl ? (
                      <img
                        src={conv.otherParty.avatarUrl}
                        alt={conv.otherParty.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#C0A4A3]/20 flex items-center justify-center text-[#C0A4A3] font-bold text-sm">
                        {conv.otherParty.name[0]}
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className={`text-sm truncate ${hasUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}
                      >
                        {conv.otherParty.name}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0 ms-2">
                        {conv.lastMessage && (
                          <span className="text-[10px] text-gray-400">
                            {formatPreviewDate(conv.lastMessage.createdAt)}
                          </span>
                        )}
                        {hasUnread && (
                          <span className="bg-[#C0A4A3] text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                            {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>

                    <p
                      className={`text-xs truncate ${hasUnread ? 'text-gray-700 font-medium' : 'text-gray-400'}`}
                    >
                      {conv.lastMessage?.body ?? 'لا توجد رسائل'}
                    </p>

                    <span className="text-[10px] text-gray-300 mt-0.5 inline-block">
                      {conv.type === 'DIRECT_REQUEST' ? '📩 طلب مباشر' : '📋 عرض مشروع'}
                    </span>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </aside>

      {/* ── LEFT panel: Thread ──────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50">
        {!selectedId ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <div className="text-7xl mb-5 opacity-10">💬</div>
            <p className="text-gray-400 font-medium">اختر محادثة لعرضها</p>
          </div>
        ) : (
          <>
            {/* Thread header */}
            <div className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center gap-3 shadow-sm shrink-0">
              {selectedConv?.otherParty.avatarUrl ? (
                <img
                  src={selectedConv.otherParty.avatarUrl}
                  alt={selectedConv.otherParty.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#C0A4A3]/20 flex items-center justify-center text-[#C0A4A3] font-bold text-sm">
                  {selectedConv?.otherParty.name[0]}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-800 text-sm">{selectedConv?.otherParty.name}</p>
                <p className="text-xs text-gray-400">
                  {selectedConv?.type === 'DIRECT_REQUEST' ? '📩 طلب مباشر' : '📋 عرض على مشروع'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
              {loadingMsgs ? (
                <div className="flex justify-center pt-12 text-gray-400 text-sm">
                  جارٍ تحميل الرسائل…
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center pt-12 text-gray-400 text-sm">
                  لا توجد رسائل بعد — ابدأ المحادثة!
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === currentUserId
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}
                      // RTL: justify-start = right side (mine), justify-end = left side (theirs)
                    >
                      <div className="max-w-[65%]">
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                            isMe
                              ? 'bg-[#C0A4A3] text-white rounded-tr-sm'
                              : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm'
                          }`}
                        >
                          {msg.body}
                        </div>
                        <p
                          className={`text-[10px] text-gray-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}
                        >
                          {formatTime(msg.createdAt)}
                          {isMe && msg.readAt && (
                            <span className="me-1 text-[#C0A4A3]"> ✓✓</span>
                          )}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input box */}
            <div className="bg-white border-t border-gray-100 px-6 py-4 shrink-0">
              <div className="flex items-end gap-3">
                {/* Textarea — right side in RTL */}
                <textarea
                  ref={textareaRef}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onInput={(e) => autoResize(e.currentTarget)}
                  placeholder="اكتب رسالتك هنا…"
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-1 focus:ring-[#C0A4A3] transition-colors bg-gray-50 min-h-[44px] max-h-[120px]"
                />
                {/* Send button — left side in RTL */}
                <button
                  onClick={sendMessage}
                  disabled={!body.trim() || sending}
                  className="bg-[#C0A4A3] hover:bg-[#A88887] disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shrink-0"
                >
                  {sending ? '⏳' : 'إرسال'}
                </button>
              </div>
              <p className="text-[10px] text-gray-300 mt-1.5 text-left">
                Enter للإرسال · Shift+Enter لسطر جديد
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
