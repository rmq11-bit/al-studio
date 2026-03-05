import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const IS_DEV = process.env.NODE_ENV === 'development'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const { conversationId, body } = await req.json()

    if (!conversationId || !body?.trim())
      return NextResponse.json(
        { error: 'معرف المحادثة ومحتوى الرسالة مطلوبان' },
        { status: 400 }
      )

    const conv = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { consumerId: true, photographerId: true },
    })
    if (!conv) return NextResponse.json({ error: 'المحادثة غير موجودة' }, { status: 404 })

    // Ownership check — determine senderRole
    let senderRole = 'CLIENT'
    if (session.user.role === 'PHOTOGRAPHER') {
      const profile = await prisma.photographerProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      })
      if (!profile || conv.photographerId !== profile.id)
        return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
      senderRole = 'PHOTOGRAPHER'
    } else {
      if (conv.consumerId !== session.user.id)
        return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        senderRole,
        body: body.trim(),
      },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
      },
    })

    // Bump conversation.updatedAt so list ordering stays fresh
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('[messages/send] error:', error)
    const msg =
      IS_DEV && error instanceof Error ? error.message : 'حدث خطأ، حاول مرة أخرى.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
