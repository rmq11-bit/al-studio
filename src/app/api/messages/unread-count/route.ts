import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// Lightweight endpoint — polled by the Header every 30 s
export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ count: 0 })

    const isPhotographer = session.user.role === 'PHOTOGRAPHER'
    let conversationFilter: object

    if (isPhotographer) {
      const profile = await prisma.photographerProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      })
      if (!profile) return NextResponse.json({ count: 0 })
      conversationFilter = { photographerId: profile.id }
    } else {
      conversationFilter = { consumerId: session.user.id }
    }

    const count = await prisma.message.count({
      where: {
        conversation: conversationFilter,
        senderId: { not: session.user.id },
        readAt: null,
      },
    })

    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ count: 0 })
  }
}
