import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function ConsumerProjectsPage() {
  const session = await auth()

  const projects = await prisma.projectPost.findMany({
    where: { consumerId: session!.user.id },
    include: { _count: { select: { bids: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">مشاريعي</h1>
          <p className="text-sm text-gray-400 mt-1">{projects.length} مشروع</p>
        </div>
        <Link
          href="/consumer/dashboard/projects/new"
          className="bg-[#C0A4A3] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#A88887] transition-colors"
        >
          + مشروع جديد
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-5xl mb-3">📋</div>
          <p className="text-lg font-medium text-gray-700">لا توجد مشاريع بعد</p>
          <p className="text-sm text-gray-400 mt-1 mb-5">أنشئ مشروعاً لتلقي عروض من المصورين</p>
          <Link
            href="/consumer/dashboard/projects/new"
            className="bg-[#C0A4A3] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#A88887] transition-colors inline-block"
          >
            إنشاء مشروع
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/consumer/dashboard/projects/${p.id}`}
              className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all hover:border-[#C0A4A3]/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800 text-base">{p.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      p.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {p.status === 'OPEN' ? 'مفتوح' : 'مغلق'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{p.description}</p>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>⏱️ {p.hours} ساعة</span>
                    <span>📅 {new Date(p.createdAt).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
                <div className="text-center shrink-0">
                  <div className="text-2xl font-black text-[#C0A4A3]">{p._count.bids}</div>
                  <div className="text-xs text-gray-400">عرض</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
