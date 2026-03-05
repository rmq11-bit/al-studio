import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { checkAndExpireTrial } from '@/lib/subscription'
import { getPhotographerSubscription } from '@/lib/subscription/requireActivePhotographer'
import SubscriptionBanner from '@/components/SubscriptionBanner'

const navItems = [
  { href: '/photographer/dashboard', label: 'الرئيسية', icon: '🏠' },
  { href: '/photographer/dashboard/profile', label: 'الملف الشخصي', icon: '👤' },
  { href: '/photographer/dashboard/media', label: 'المعرض', icon: '🖼️' },
  { href: '/photographer/dashboard/availability', label: 'التقويم', icon: '📅' },
  { href: '/photographer/dashboard/requests', label: 'الطلبات', icon: '📩' },
  { href: '/photographer/dashboard/messages', label: 'الرسائل', icon: '💬' },
]

export default async function PhotographerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session || session.user.role !== 'PHOTOGRAPHER') redirect('/auth/login')

  // Fetch subscription status for banner + gating
  const profile = await prisma.photographerProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, subscriptionStatus: true, trialEndsAt: true },
  })

  const effectiveStatus = profile
    ? await checkAndExpireTrial(profile.id, profile.subscriptionStatus, profile.trialEndsAt)
    : 'TRIAL'

  // Gate: redirect to pricing if not ACTIVE
  const sub = await getPhotographerSubscription(session.user.id)
  if (!sub?.isActive) {
    redirect('/pricing?reason=required')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Subscription banner (client component — handles modal) */}
      <SubscriptionBanner status={effectiveStatus} expiresAt={sub?.expiresAt} />

      <div className="flex flex-1">
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
                <p className="text-xs text-[#C0A4A3]">مصور</p>
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

            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link
                href={`/photographer/${session.user.id}`}
                className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-[#C0A4A3] transition-colors"
                target="_blank"
              >
                <span>👁️</span> عرض الملف العام
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 p-6">{children}</div>
      </div>
    </div>
  )
}
