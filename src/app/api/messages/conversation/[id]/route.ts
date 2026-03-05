import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const IS_DEV = process.env.NODE_ENV === 'development'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const { id } = await params

    const conv = await prisma.conversation.findUnique({
      where: { id },
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

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('[messages/conversation/id] error:', error)
    const msg =
      IS_DEV && error instanceof Error ? error.message : 'حدث خطأ، حاول مرة أخرى.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
