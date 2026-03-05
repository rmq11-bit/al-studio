import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  if (session.user.role === 'PHOTOGRAPHER') {
    const profile = await prisma.photographerProfile.findUnique({
      where: { userId: session.user.id },
    })
    if (!profile) return NextResponse.json([])

    const conversations = await prisma.conversation.findMany({
      where: { photographerId: profile.id },
      include: {
        consumer: { select: { id: true, name: true, avatarUrl: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(conversations)
  } else {
    const conversations = await prisma.conversation.findMany({
      where: { consumerId: session.user.id },
      include: {
        photographer: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(conversations)
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const { photographerUserId } = await req.json()

  if (!photographerUserId)
    return NextResponse.json({ error: 'معرف المصور مطلوب' }, { status: 400 })

  const profile = await prisma.photographerProfile.findUnique({
    where: { userId: photographerUserId },
  })
  if (!profile) return NextResponse.json({ error: 'المصور غير موجود' }, { status: 404 })

  let consumerId: string
  let photographerId: string = profile.id

  if (session.user.role === 'CONSUMER') {
    consumerId = session.user.id
  } else {
    // Photographer initiating — need consumerId in body
    const body = await req.json()
    consumerId = body.consumerId
  }

  // Find existing or create (unique constraint removed — now one conv per directRequest/bid)
  const existing = await prisma.conversation.findFirst({
    where: { consumerId, photographerId, type: 'DIRECT_REQUEST' },
  })
  const conv = existing ?? await prisma.conversation.create({
    data: { type: 'DIRECT_REQUEST', consumerId, photographerId },
  })

  return NextResponse.json(conv, { status: existing ? 200 : 201 })
}
