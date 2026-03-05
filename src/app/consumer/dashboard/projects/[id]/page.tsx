import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BidForm from './BidForm'
import CloseProjectButton from './CloseProjectButton'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()

  const project = await prisma.projectPost.findUnique({
    where: { id },
    include: {
      consumer: { select: { id: true, name: true, avatarUrl: true } },
      bids: {
        include: {
          photographer: {
            include: { user: { select: { id: true, name: true, avatarUrl: true } } },
          },
        },
        orderBy: { price: 'asc' },
      },
    },
  })

  if (!project) notFound()

  // Check if current user is the consumer
  const isOwner = session?.user.id === project.consumerId
  // Check if current user is a photographer who already bid
  const myProfile = session?.user.role === 'PHOTOGRAPHER'
    ? await prisma.photographerProfile.findUnique({ where: { userId: session.user.id } })
    : null
  const myBid = myProfile ? project.bids.find((b) => b.photographerId === myProfile.id) : null

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/consumer/dashboard/projects" className="text-gray-400 hover:text-gray-600 transition-colors">
          ← العودة
        </Link>
      </div>

      {/* Project info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-800">{project.title}</h1>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ${
                project.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {project.status === 'OPEN' ? 'مفتوح' : 'مغلق'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>بواسطة {project.consumer.name}</span>
              <span>•</span>
              <span>{new Date(project.createdAt).toLocaleDateString('ar-SA')}</span>
            </div>
          </div>
          {isOwner && project.status === 'OPEN' && (
            <CloseProjectButton projectId={project.id} />
          )}
        </div>

        <p className="text-gray-600 leading-relaxed mb-4">{project.description}</p>

        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">عدد ساعات التصوير:</span>
            <span className="font-bold text-gray-800">{project.hours} ساعة</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">عدد العروض:</span>
            <span className="font-bold text-[#C0A4A3]">{project.bids.length}</span>
          </div>
        </div>
      </div>

      {/* Bids section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-bold text-gray-800 mb-4">
          العروض المقدمة ({project.bids.length})
        </h2>

        {project.bids.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <div className="text-4xl mb-2">📭</div>
            <p>لا توجد عروض بعد</p>
          </div>
        ) : (
          <div className="space-y-4">
            {project.bids.map((bid, idx) => (
              <div
                key={bid.id}
                className={`rounded-2xl border p-4 ${
                  idx === 0 ? 'border-[#C0A4A3]/50 bg-[#C0A4A3]/5' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start gap-4">
                  {idx === 0 && (
                    <div className="text-xs bg-[#C0A4A3] text-white px-2 py-0.5 rounded-full font-semibold shrink-0 mt-1">
                      الأقل سعراً
                    </div>
                  )}
                  {bid.photographer.user.avatarUrl ? (
                    <img
                      src={bid.photographer.user.avatarUrl}
                      alt={bid.photographer.user.name}
                      className="w-11 h-11 rounded-xl object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-[#C0A4A3] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {bid.photographer.user.name[0]}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/photographer/${bid.photographer.userId}`}
                        className="font-bold text-gray-800 hover:text-[#C0A4A3] transition-colors"
                      >
                        {bid.photographer.user.name}
                      </Link>
                      <span className="text-xl font-black text-[#C0A4A3] shrink-0">
                        {bid.price.toLocaleString('ar-SA')} ريال
                      </span>
                    </div>
                    {bid.message && (
                      <p className="text-sm text-gray-500 mt-2 leading-relaxed">{bid.message}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(bid.createdAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bid form for photographers */}
      {session?.user.role === 'PHOTOGRAPHER' && project.status === 'OPEN' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4">تقديم عرضك</h2>
          {myBid ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700">
              <p className="font-semibold">✅ لقد قدمت عرضاً بسعر {myBid.price.toLocaleString('ar-SA')} ريال</p>
            </div>
          ) : (
            <BidForm projectId={project.id} />
          )}
        </div>
      )}

      {/* Open projects for all visitors */}
      {!session && project.status === 'OPEN' && (
        <div className="bg-[#C0A4A3]/5 rounded-2xl border border-[#C0A4A3]/20 p-6 text-center">
          <p className="text-gray-600 mb-3">هل أنت مصور؟ سجل دخولك لتقديم عرضك</p>
          <Link
            href="/auth/login"
            className="bg-[#C0A4A3] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#A88887] transition-colors inline-block"
          >
            تسجيل الدخول
          </Link>
        </div>
      )}
    </div>
  )
}
