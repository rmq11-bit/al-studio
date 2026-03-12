import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function ConsumerDashboardHome() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null // layout guard already redirects; this is a safety net

  const [projectCount, conversationCount, requestCount] = await Promise.all([
    prisma.projectPost.count({ where: { consumerId: userId } }),
    prisma.conversation.count({ where: { consumerId: userId } }),
    prisma.directRequest.count({ where: { consumerId: userId } }),
  ])

  const recentProjects = await prisma.projectPost.findMany({
    where: { consumerId: userId },
    include: { _count: { select: { bids: true } } },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  const stats = [
    { label: 'مشاريعي', value: projectCount, icon: '📋', href: '/consumer/dashboard/projects' },
    { label: 'المحادثات', value: conversationCount, icon: '💬', href: '/consumer/dashboard/messages' },
    { label: 'طلباتي المباشرة', value: requestCount, icon: '📩', href: '#' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        مرحباً، {session?.user?.name ?? ''} 👋
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="text-3xl font-black text-[#C0A4A3] mb-1">{s.value}</div>
            <div className="text-sm text-gray-500 font-medium">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/browse"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-[#C0A4A3]/10 rounded-2xl flex items-center justify-center text-2xl">🔍</div>
          <div>
            <p className="font-bold text-gray-800">تصفح المصورين</p>
            <p className="text-sm text-gray-400">ابحث عن مصور مناسب</p>
          </div>
        </Link>
        <Link
          href="/consumer/dashboard/projects/new"
          className="bg-[#C0A4A3] rounded-2xl shadow-sm p-6 hover:bg-[#A88887] transition-colors flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">✨</div>
          <div>
            <p className="font-bold text-white">نشر مشروع جديد</p>
            <p className="text-sm text-white/70">احصل على عروض من مصورين</p>
          </div>
        </Link>
      </div>

      {/* Recent projects */}
      {recentProjects.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">مشاريعي الأخيرة</h2>
            <Link href="/consumer/dashboard/projects" className="text-xs text-[#C0A4A3] font-semibold">
              عرض الكل
            </Link>
          </div>
          <div className="space-y-3">
            {recentProjects.map((p) => (
              <Link
                key={p.id}
                href={`/consumer/dashboard/projects/${p.id}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-[#C0A4A3]/5 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{p.title}</p>
                  <p className="text-xs text-gray-400">{p.hours} ساعة</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#C0A4A3]">{p._count.bids} عرض</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    p.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {p.status === 'OPEN' ? 'مفتوح' : 'مغلق'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
