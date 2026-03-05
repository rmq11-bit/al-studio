import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BidFormPublic from './BidFormPublic'

export default async function PublicProjectPage({
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

  const myProfile = session?.user.role === 'PHOTOGRAPHER'
    ? await prisma.photographerProfile.findUnique({ where: { userId: session.user.id } })
    : null
  const myBid = myProfile ? project.bids.find((b) => b.photographerId === myProfile.id) : null
  const isOwner = session?.user.id === project.consumerId

  // Consumer owners go to their dashboard version
  if (isOwner) {
    const { redirect } = await import('next/navigation')
    redirect(`/consumer/dashboard/projects/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/projects" className="text-gray-400 hover:text-gray-600 transition-colors text-sm flex items-center gap-1 mb-6">
          ← المشاريع المتاحة
        </Link>

        {/* Project */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-800">{project.title}</h1>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                  project.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {project.status === 'OPEN' ? 'مفتوح' : 'مغلق'}
                </span>
              </div>
              <p className="text-sm text-gray-400">
                بواسطة {project.consumer.name} • {new Date(project.createdAt).toLocaleDateString('ar-SA')}
              </p>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">{project.description}</p>
          <div className="flex gap-6 text-sm">
            <div><span className="text-gray-400">عدد ساعات التصوير: </span><span className="font-bold">{project.hours} ساعة</span></div>
            <div><span className="text-gray-400">العروض: </span><span className="font-bold text-[#C0A4A3]">{project.bids.length}</span></div>
          </div>
        </div>

        {/* Bid form */}
        {session?.user.role === 'PHOTOGRAPHER' && project.status === 'OPEN' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="font-bold text-gray-800 mb-4">تقديم عرضك</h2>
            {myBid ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm">
                ✅ لقد قدمت عرضاً بسعر {myBid.price.toLocaleString('ar-SA')} ريال
              </div>
            ) : (
              <BidFormPublic projectId={project.id} />
            )}
          </div>
        )}

        {!session && (
          <div className="bg-[#C0A4A3]/5 rounded-2xl border border-[#C0A4A3]/20 p-6 text-center mb-6">
            <p className="text-gray-600 mb-3">هل أنت مصور؟ سجل دخولك لتقديم عرضك</p>
            <Link href="/auth/login" className="bg-[#C0A4A3] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#A88887] transition-colors inline-block">
              تسجيل الدخول
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
