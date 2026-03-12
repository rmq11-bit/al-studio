'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function Header() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [unread, setUnread] = useState(0)

  // Poll unread message count every 30 s when logged in
  useEffect(() => {
    if (!session) { setUnread(0); return }

    async function fetchUnread() {
      try {
        const res = await fetch('/api/messages/unread-count')
        if (res.ok) {
          const data = await res.json()
          setUnread(data.count ?? 0)
        }
      } catch {}
    }

    fetchUnread()
    const timer = setInterval(fetchUnread, 30_000)
    return () => clearInterval(timer)
  }, [session])

  // ── Safe role/user helpers ─────────────────────────────────────────────────
  // In NextAuth v5, Session.user is typed as optional (user?: User). Even when
  // `session` is not null, `session.user` can be undefined during JWT
  // validation failures or NextAuth beta edge-cases. All property accesses use
  // optional chaining to prevent "Cannot read properties of undefined (reading
  // 'role')" from crashing the entire page for every visitor.
  const role     = (session?.user as any)?.role as string | undefined
  const userName = session?.user?.name
  const avatarUrl = (session?.user as any)?.avatarUrl as string | undefined

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
            style={{ color: '#C0A4A3' }}
          >
            الاستوديو
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/browse"
              className="text-gray-600 hover:text-[#C0A4A3] transition-colors font-medium"
            >
              المصورون
            </Link>
            <Link
              href="/projects"
              className="text-gray-600 hover:text-[#C0A4A3] transition-colors font-medium"
            >
              المشاريع
            </Link>
            {session ? (
              <>
                {/* Messages link — all logged-in roles */}
                <Link
                  href="/messages"
                  className="relative text-gray-600 hover:text-[#C0A4A3] transition-colors font-medium"
                >
                  الرسائل
                  {unread > 0 && (
                    <span className="absolute -top-2 -left-2 bg-[#C0A4A3] text-white text-[9px] font-black rounded-full min-w-[16px] h-[16px] px-0.5 flex items-center justify-center leading-none">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </Link>

                {role === 'PHOTOGRAPHER' && (
                  <Link
                    href="/photographer/dashboard"
                    className="text-gray-600 hover:text-[#C0A4A3] transition-colors font-medium"
                  >
                    لوحة التحكم
                  </Link>
                )}
                {role === 'CONSUMER' && (
                  <>
                    <Link
                      href="/consumer/dashboard"
                      className="text-gray-600 hover:text-[#C0A4A3] transition-colors font-medium"
                    >
                      لوحة التحكم
                    </Link>
                    <Link
                      href="/consumer/dashboard/projects/new"
                      className="bg-[#C0A4A3] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#A88887] transition-colors"
                    >
                      + مشروع جديد
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={userName ?? ''}
                      className="w-8 h-8 rounded-full object-cover border-2 border-[#C0A4A3]/30"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#C0A4A3] flex items-center justify-center text-white text-sm font-bold">
                      {userName?.[0] ?? '؟'}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {userName}
                  </span>
                </div>
                <Link
                  href="/choose-role"
                  className="text-sm text-gray-400 hover:text-[#C0A4A3] transition-colors"
                  title="تغيير الدور الافتراضي"
                >
                  تبديل
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm text-gray-400 hover:text-red-400 transition-colors"
                >
                  خروج
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-[#C0A4A3] transition-colors font-medium"
                >
                  دخول
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-[#C0A4A3] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#A88887] transition-colors"
                >
                  تسجيل
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
