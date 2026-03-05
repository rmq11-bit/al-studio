import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const { id } = await params

  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    include: {
      sender: { select: { id: true, name: true, avatarUrl: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(messages)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const { id } = await params
  const { body: msgBody } = await req.json()

  if (!msgBody?.trim())
    return NextResponse.json({ error: 'الرسالة فارغة' }, { status: 400 })

  // Verify user is part of this conversation
  const conv = await prisma.conversation.findUnique({ where: { id } })
  if (!conv) return NextResponse.json({ error: 'المحادثة غير موجودة' }, { status: 404 })

  const profile = session.user.role === 'PHOTOGRAPHER'
    ? await prisma.photographerProfile.findUnique({ where: { userId: session.user.id } })
    : null

  const isParticipant =
    conv.consumerId === session.user.id ||
    (profile && conv.photographerId === profile.id)

  if (!isParticipant)
    return NextResponse.json({ error: 'غير مصرح بإرسال رسالة في هذه المحادثة' }, { status: 403 })

  const message = await prisma.message.create({
    data: {
      conversationId: id,
      senderId: session.user.id,
      body: msgBody.trim(),
    },
    include: {
      sender: { select: { id: true, name: true, avatarUrl: true } },
    },
  })

  return NextResponse.json(message, { status: 201 })
}
