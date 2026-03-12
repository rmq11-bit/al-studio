import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function PhotographerDashboardHome() {
  const session = await auth()

  const profile = await prisma.photographerProfile.findUnique({
    where: { userId: session!.user.id },
    include: {
      _count: { select: { media: true, incomingRequests: true, bids: true } },
      incomingRequests: {
        where: { status: 'PENDING' },
        take: 5,
        include: { consumer: { select: { name: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  const stats = [
    { label: 'صور ومقاطع', value: profile?._count.media ?? 0, icon: '🖼️', href: '/photographer/dashboard/media' },
    { label: 'طلبات معلقة', value: profile?.incomingRequests.length ?? 0, icon: '📩', href: '/photographer/dashboard/requests' },
    { label: 'عروض مقدمة', value: profile?._count.bids ?? 0, icon: '💼', href: '#' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        مرحباً، {session!.user.name} 👋
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

      {/* Pending requests */}
      {(profile?.incomingRequests.length ?? 0) > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">طلبات تنتظر ردك</h2>
            <Link href="/photographer/dashboard/requests" className="text-xs text-[#C0A4A3] font-semibold">
              عرض الكل
            </Link>
          </div>
          <div className="space-y-3">
            {profile?.incomingRequests.map((req) => (
              <div key={req.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                {req.consumer.avatarUrl ? (
                  <img src={req.consumer.avatarUrl} alt={req.consumer.name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold text-sm">
                    {req.consumer.name[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{req.consumer.name}</p>
                  <p className="text-xs text-gray-500">
                    {req.hours} ساعة{req.date ? ` • ${req.date}` : ''}
                  </p>
                </div>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  معلق
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      {!profile?.incomingRequests.length && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="text-4xl mb-3">✨</div>
          <p className="text-gray-600 font-medium mb-4">أكمل ملفك الشخصي لتظهر في نتائج البحث</p>
          <Link
            href="/photographer/dashboard/profile"
            className="bg-[#C0A4A3] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#A88887] transition-colors inline-block"
          >
            إكمال الملف الشخصي
          </Link>
        </div>
      )}
    </div>
  )
}
