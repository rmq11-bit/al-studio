import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { effectiveSubscriptionWhere } from '@/lib/subscription/isEffectiveSubscriptionActive'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const specialty = searchParams.get('specialty')
  const minRate = searchParams.get('minRate')
  const maxRate = searchParams.get('maxRate')
  const q = searchParams.get('q')

  const where: Record<string, unknown> = { ...effectiveSubscriptionWhere() }

  if (specialty) {
    where.specialties = { contains: specialty }
  }

  const rateFilter: Record<string, number> = {}
  if (minRate) rateFilter.gte = parseFloat(minRate)
  if (maxRate) rateFilter.lte = parseFloat(maxRate)
  if (Object.keys(rateFilter).length > 0) where.hourlyRate = rateFilter

  let photographers = await prisma.photographerProfile.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, avatarUrl: true, bio: true } },
      media: { take: 4, orderBy: { createdAt: 'desc' } },
    },
    orderBy: { hourlyRate: 'asc' },
  })

  if (q) {
    const lower = q.toLowerCase()
    photographers = photographers.filter((p) =>
      p.user.name.toLowerCase().includes(lower)
    )
  }

  return NextResponse.json(photographers)
}
