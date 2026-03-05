import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import Link from 'next/link'

export default async function ProjectsPage() {
  const session = await auth()

  const projects = await prisma.projectPost.findMany({
    where: { status: 'OPEN' },
    include: {
      consumer: { select: { id: true, name: true, avatarUrl: true } },
      _count: { select: { bids: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">المشاريع المتاحة</h1>
            <p className="text-gray-400 mt-1 text-sm">{projects.length} مشروع مفتوح</p>
          </div>
          {session?.user.role === 'CONSUMER' && (
            <Link
              href="/consumer/dashboard/projects/new"
              className="bg-[#C0A4A3] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#A88887] transition-colors"
            >
              + نشر مشروع
            </Link>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-5xl mb-3">📋</div>
            <p className="text-xl font-medium text-gray-700">لا توجد مشاريع مفتوحة</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={session?.user.role === 'CONSUMER'
                  ? `/consumer/dashboard/projects/${p.id}`
                  : `/projects/${p.id}`}
                className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all hover:border-[#C0A4A3]/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-lg mb-2">{p.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                      {p.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>⏱️ {p.hours} ساعة</span>
                      <span>📅 {new Date(p.createdAt).toLocaleDateString('ar-SA')}</span>
                      <span className="flex items-center gap-1">
                        بواسطة{' '}
                        {p.consumer.avatarUrl ? (
                          <img src={p.consumer.avatarUrl} alt={p.consumer.name} className="w-4 h-4 rounded-full object-cover" />
                        ) : null}
                        {p.consumer.name}
                      </span>
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
    </div>
  )
}
