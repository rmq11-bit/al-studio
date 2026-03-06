import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { notFound } from 'next/navigation'
import { SPECIALTY_LABELS, parseSpecialties } from '@/lib/specialties'
import MediaGrid from '@/components/MediaGrid'
import CalendarView from '@/components/CalendarView'
import DirectRequestModal from './DirectRequestModal'
import ConversationButton from './ConversationButton'
import { checkAndExpireTrial } from '@/lib/subscription'
import { isEffectiveSubscriptionActive } from '@/lib/subscription/isEffectiveSubscriptionActive'

export default async function PhotographerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()

  const user = await prisma.user.findUnique({
    where: { id, role: 'PHOTOGRAPHER' },
    include: {
      photographerProfile: {
        include: {
          media: { orderBy: { createdAt: 'desc' } },
          availability: { orderBy: { date: 'asc' } },
        },
      },
    },
  })

  if (!user || !user.photographerProfile) notFound()

  const profile = user.photographerProfile
  const specialties = parseSpecialties(profile.specialties)

  // Auto-expire trial → PAST_DUE if needed, then check effective access
  const effectiveStatus = await checkAndExpireTrial(
    profile.id,
    profile.subscriptionStatus,
    profile.trialEndsAt
  )
  // ACTIVE or CANCELED+not-expired both grant access; everything else → 404
  const photographerIsActive = isEffectiveSubscriptionActive(
    effectiveStatus,
    profile.subscriptionExpiresAt,
  )

  if (!photographerIsActive) notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-28 h-28 rounded-2xl object-cover ring-4 ring-[#C0A4A3]/20"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-[#C0A4A3] flex items-center justify-center text-white text-4xl font-bold">
                  {user.name[0]}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-black text-gray-800 mb-1">{user.name}</h1>
              {profile.location && (
                <p className="text-gray-400 text-sm mb-3 flex items-center gap-1">
                  <span>📍</span> {profile.location}
                </p>
              )}
              {user.bio && (
                <p className="text-gray-600 text-sm leading-relaxed mb-4 max-w-xl">{user.bio}</p>
              )}

              {/* Rate */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-500">السعر في الساعة الواحدة:</span>
                <span className="text-xl font-bold text-[#C0A4A3]">
                  {profile.hourlyRate.toLocaleString('ar-SA')} ريال
                </span>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2 font-medium">التخصص</p>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((s) => (
                    <span
                      key={s}
                      className="bg-[#C0A4A3]/10 text-[#C0A4A3] px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {SPECIALTY_LABELS[s] ?? s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons for consumers */}
              {session && session.user.role === 'CONSUMER' && (
                <div className="flex gap-3 flex-wrap">
                  <DirectRequestModal
                    photographerUserId={user.id}
                    photographerName={user.name}
                    isActive={photographerIsActive}
                  />
                  <ConversationButton photographerUserId={user.id} />
                </div>
              )}

              {!session && (
                <p className="text-sm text-gray-400">
                  <a href="/auth/login" className="text-[#C0A4A3] font-semibold">
                    سجل دخولك
                  </a>{' '}
                  كعميل للتواصل مع هذا المصور
                </p>
              )}
            </div>

            {/* Media count badge */}
            <div className="text-center shrink-0">
              <div className="text-3xl font-black text-[#C0A4A3]">{profile.media.length}</div>
              <div className="text-xs text-gray-400">صورة/فيديو</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Gallery */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">معرض الأعمال</h2>
          <MediaGrid media={profile.media} />
        </section>

        {/* Availability */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">التقويم</h2>
          <CalendarView availability={profile.availability} editable={false} />
        </section>
      </div>
    </div>
  )
}
