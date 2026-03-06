import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

const navItems = [
  { href: '/consumer/dashboard', label: 'الرئيسية', icon: '🏠' },
  { href: '/browse', label: 'تصفح المصورين', icon: '🔍' },
  { href: '/consumer/dashboard/projects', label: 'مشاريعي', icon: '📋' },
  { href: '/consumer/dashboard/projects/new', label: '+ مشروع جديد', icon: '✨' },
  { href: '/messages', label: 'الرسائل', icon: '💬' },
  { href: '/consumer/dashboard/profile', label: 'الملف الشخصي', icon: '👤' },
]

export default async function ConsumerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session || session.user.role !== 'CONSUMER') redirect('/auth/login')

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-l border-gray-100 min-h-screen shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            {(session.user as any).avatarUrl ? (
              <img
                src={(session.user as any).avatarUrl}
                alt={session.user.name ?? ''}
                className="w-10 h-10 rounded-xl object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#C0A4A3] flex items-center justify-center text-white font-bold">
                {session.user.name?.[0]}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-gray-800 text-sm truncate">{session.user.name}</p>
              <p className="text-xs text-[#C0A4A3]">عميل</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-[#C0A4A3]/10 hover:text-[#C0A4A3] transition-colors"
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 p-6">{children}</div>
    </div>
  )
}
