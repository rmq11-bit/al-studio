import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const IS_DEV = process.env.NODE_ENV === 'development'

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const isPhotographer = session.user.role === 'PHOTOGRAPHER'
    let photographerProfileId: string | null = null

    if (isPhotographer) {
      const profile = await prisma.photographerProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      })
      if (!profile) return NextResponse.json([])
      photographerProfileId = profile.id
    }

    const where = isPhotographer
      ? { photographerId: photographerProfileId! }
      : { consumerId: session.user.id }

    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        consumer: { select: { id: true, name: true, avatarUrl: true } },
        photographer: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { body: true, createdAt: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    // Compute unread count per conversation
    const result = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: session.user.id },
            readAt: null,
          },
        })

        const otherParty = isPhotographer
          ? { id: conv.consumer.id, name: conv.consumer.name, avatarUrl: conv.consumer.avatarUrl }
          : {
              id: conv.photographer.user.id,
              name: conv.photographer.user.name,
              avatarUrl: conv.photographer.user.avatarUrl,
            }

        return {
          id: conv.id,
          type: conv.type,
          projectId: conv.projectId,
          directRequestId: conv.directRequestId,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
          otherParty,
          lastMessage: conv.messages[0] ?? null,
          unreadCount,
        }
      })
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('[messages/conversations] error:', error)
    const msg =
      IS_DEV && error instanceof Error ? error.message : 'حدث خطأ، حاول مرة أخرى.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
