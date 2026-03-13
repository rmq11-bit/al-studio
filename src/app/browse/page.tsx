import { prisma } from '@/lib/prisma'
import PhotographerCard from '@/components/PhotographerCard'
import BrowseFilters from '@/components/BrowseFilters'
import { Suspense } from 'react'
import { effectiveSubscriptionWhere } from '@/lib/subscription/isEffectiveSubscriptionActive'

interface PageProps {
  searchParams: Promise<{
    specialty?: string
    minRate?: string
    maxRate?: string
    q?: string
  }>
}

async function PhotographerList({ searchParams }: { searchParams: Awaited<PageProps['searchParams']> }) {
  const where: Record<string, unknown> = { ...effectiveSubscriptionWhere() }

  if (searchParams.specialty) {
    where.specialties = { contains: searchParams.specialty }
  }

  const rateFilter: Record<string, number> = {}
  // Guard against NaN: parseFloat('abc') === NaN, which Prisma rejects at runtime
  if (searchParams.minRate) {
    const v = parseFloat(searchParams.minRate)
    if (!isNaN(v)) rateFilter.gte = v
  }
  if (searchParams.maxRate) {
    const v = parseFloat(searchParams.maxRate)
    if (!isNaN(v)) rateFilter.lte = v
  }
  if (Object.keys(rateFilter).length > 0) where.hourlyRate = rateFilter

  let photographers = await prisma.photographerProfile.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, avatarUrl: true, bio: true } },
      media: { take: 4, orderBy: { createdAt: 'desc' } },
    },
    orderBy: { hourlyRate: 'asc' },
  })

  if (searchParams.q) {
    const lower = searchParams.q.toLowerCase()
    photographers = photographers.filter((p) =>
      // Guard: user.name is non-nullable in the schema but could be null in
      // practice due to direct DB inserts or migration edge cases
      (p.user.name ?? '').toLowerCase().includes(lower)
    )
  }

  if (photographers.length === 0) {
    return (
      <div className="text-center py-24 text-gray-400">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-xl font-medium">لا يوجد مصورون يطابقون البحث</p>
        <p className="text-sm mt-2">حاول تغيير معايير البحث أو إزالة الفلاتر</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {photographers.map((p) => (
        <PhotographerCard key={p.id} photographer={p} />
      ))}
    </div>
  )
}

export default async function BrowsePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">تصفح المصورين</h1>
          <p className="text-gray-400 mt-1 text-sm">ابحث عن المصور المناسب لمشروعك</p>
        </div>

        <Suspense fallback={<div className="h-32 bg-white rounded-2xl animate-pulse" />}>
          <BrowseFilters />
        </Suspense>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
              ))}
            </div>
          }
        >
          <PhotographerList searchParams={resolvedParams} />
        </Suspense>
      </div>
    </div>
  )
}
