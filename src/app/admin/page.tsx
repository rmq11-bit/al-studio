import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminOverviewPage() {
  await requireAdmin()

  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const [
    totalUsers,
    totalPhotographers,
    totalConsumers,
    totalAdmins,
    bannedUsers,
    totalMedia,
    totalProjects,
    totalRequests,
    totalMessages,
    newUsersThisWeek,
    openProjects,
    pendingRequests,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'PHOTOGRAPHER' } }),
    prisma.user.count({ where: { role: 'CONSUMER' } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({ where: { isBanned: true } }),
    prisma.media.count(),
    prisma.projectPost.count(),
    prisma.directRequest.count(),
    prisma.message.count(),
    prisma.user.count({ where: { createdAt: { gte: oneWeekAgo } } }),
    prisma.projectPost.count({ where: { status: 'OPEN' } }),
    prisma.directRequest.count({ where: { status: 'PENDING' } }),
  ])

  const statGroups = [
    {
      title: 'Users',
      stats: [
        { label: 'Total Users',         value: totalUsers,        icon: '👥', color: 'text-blue-400' },
        { label: 'Photographers',        value: totalPhotographers, icon: '📷', color: 'text-purple-400' },
        { label: 'Clients',             value: totalConsumers,    icon: '👤', color: 'text-green-400' },
        { label: 'New This Week',       value: newUsersThisWeek,  icon: '✨', color: 'text-yellow-400' },
        { label: 'Banned',             value: bannedUsers,       icon: '🚫', color: 'text-red-400' },
        { label: 'Admins',             value: totalAdmins,       icon: '🛡️', color: 'text-indigo-400' },
      ],
    },
    {
      title: 'Content',
      stats: [
        { label: 'Media Uploads',       value: totalMedia,        icon: '🖼️', color: 'text-pink-400' },
        { label: 'Projects',           value: totalProjects,     icon: '📋', color: 'text-orange-400' },
        { label: 'Open Projects',      value: openProjects,      icon: '🟢', color: 'text-emerald-400' },
        { label: 'Direct Requests',    value: totalRequests,     icon: '📩', color: 'text-cyan-400' },
        { label: 'Pending Requests',   value: pendingRequests,   icon: '⏳', color: 'text-amber-400' },
        { label: 'Messages Sent',      value: totalMessages,     icon: '💬', color: 'text-sky-400' },
      ],
    },
  ]

  const quickLinks = [
    { href: '/admin/users',    label: 'Manage Users',    icon: '👥', desc: `${totalUsers} total` },
    { href: '/admin/media',    label: 'Manage Media',    icon: '🖼️', desc: `${totalMedia} uploads` },
    { href: '/admin/projects', label: 'Manage Projects', icon: '📋', desc: `${totalProjects} total` },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Platform Overview</h1>
        <p className="text-gray-500 text-sm">Real-time stats from the database</p>
      </div>

      {statGroups.map((group) => (
        <div key={group.title} className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{group.title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {group.stats.map((s) => (
              <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="text-xl mb-2">{s.icon}</div>
                <div className={`text-2xl font-black mb-0.5 ${s.color}`}>{s.value}</div>
                <div className="text-gray-500 text-xs font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Quick nav cards */}
      <div className="mt-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-5 flex items-start gap-4 transition-colors group"
            >
              <span className="text-2xl">{l.icon}</span>
              <div>
                <p className="text-white font-semibold group-hover:text-indigo-400 transition-colors">{l.label}</p>
                <p className="text-gray-500 text-xs mt-0.5">{l.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
