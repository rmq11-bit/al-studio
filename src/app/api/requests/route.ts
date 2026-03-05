import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { checkAndExpireTrial } from '@/lib/subscription'
import { isEffectiveSubscriptionActive } from '@/lib/subscription/isEffectiveSubscriptionActive'
import { getOrCreateDirectRequestConversation } from '@/lib/messaging'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  if (session.user.role === 'PHOTOGRAPHER') {
    const profile = await prisma.photographerProfile.findUnique({
      where: { userId: session.user.id },
    })
    if (!profile) return NextResponse.json([])

    const requests = await prisma.directRequest.findMany({
      where: { photographerId: profile.id },
      include: {
        consumer: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(requests)
  } else {
    const requests = await prisma.directRequest.findMany({
      where: { consumerId: session.user.id },
      include: {
        photographer: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(requests)
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'CONSUMER')
    return NextResponse.json({ error: 'فقط العملاء يمكنهم إرسال طلبات مباشرة' }, { status: 403 })

  const { photographerUserId, date, hours, notes } = await req.json()

  if (!photographerUserId) return NextResponse.json({ error: 'معرف المصور مطلوب' }, { status: 400 })
  if (!hours || hours <= 0) return NextResponse.json({ error: 'عدد الساعات مطلوب' }, { status: 400 })

  const profile = await prisma.photographerProfile.findUnique({
    where: { userId: photographerUserId },
  })
  if (!profile) return NextResponse.json({ error: 'المصور غير موجود' }, { status: 404 })

  // Auto-expire trial if needed, then check effective access
  const effectiveStatus = await checkAndExpireTrial(profile.id, profile.subscriptionStatus, profile.trialEndsAt)
  if (!isEffectiveSubscriptionActive(effectiveStatus, profile.subscriptionExpiresAt)) {
    return NextResponse.json({ error: 'هذا المصور لا يستقبل طلبات حالياً' }, { status: 403 })
  }

  const request = await prisma.directRequest.create({
    data: {
      consumerId: session.user.id,
      photographerId: profile.id,
      date: date ?? null,
      hours: parseFloat(hours),
      notes: notes ?? null,
      status: 'PENDING',
    },
  })

  // Auto-create a conversation linked to this direct request
  const conversationId = await getOrCreateDirectRequestConversation(
    request.id,
    session.user.id,
    profile.id
  )

  return NextResponse.json({ ...request, conversationId }, { status: 201 })
}
