import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const IS_DEV = process.env.NODE_ENV === 'development'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const { conversationId } = await req.json()
    if (!conversationId)
      return NextResponse.json({ error: 'معرف المحادثة مطلوب' }, { status: 400 })

    const conv = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { consumerId: true, photographerId: true },
    })
    if (!conv) return NextResponse.json({ error: 'المحادثة غير موجودة' }, { status: 404 })

    // Ownership check
    if (session.user.role === 'PHOTOGRAPHER') {
      const profile = await prisma.photographerProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      })
      if (!profile || conv.photographerId !== profile.id)
        return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    } else {
      if (conv.consumerId !== session.user.id)
        return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    // Mark all messages sent by the other party as read
    const { count } = await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: session.user.id },
        readAt: null,
      },
      data: { readAt: new Date() },
    })

    return NextResponse.json({ ok: true, markedRead: count })
  } catch (error) {
    console.error('[messages/read] error:', error)
    const msg =
      IS_DEV && error instanceof Error ? error.message : 'حدث خطأ، حاول مرة أخرى.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
