import Link from 'next/link'
import { requireAdmin } from '@/lib/admin'

const navItems = [
  { href: '/admin',          label: 'Overview',   icon: '📊' },
  { href: '/admin/users',    label: 'Users',      icon: '👥' },
  { href: '/admin/media',    label: 'Media',      icon: '🖼️' },
  { href: '/admin/projects', label: 'Projects',   icon: '📋' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin()
  const adminName = session.user?.name ?? 'Admin'

  return (
    <div className="min-h-screen bg-gray-950 flex text-sm">

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="w-52 bg-gray-900 border-r border-gray-800 shrink-0 sticky top-0 h-screen flex flex-col">

        {/* Brand */}
        <div className="px-5 py-5 border-b border-gray-800">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Admin Panel</p>
          <p className="text-white font-bold truncate">الاستوديو</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors font-medium"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Admin user badge */}
        <div className="px-4 py-4 border-t border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {adminName[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{adminName}</p>
              <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between shrink-0">
          <span className="text-gray-500 text-xs font-mono">admin.al-studio</span>
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Back to site
          </Link>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
