import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { assertActivePhotographer } from '@/lib/subscription/requireActivePhotographer'
import { getOrCreateProjectBidConversation } from '@/lib/messaging'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== 'PHOTOGRAPHER')
    return NextResponse.json({ error: 'فقط المصورون يمكنهم تقديم عروض' }, { status: 403 })

  const { id: projectId } = await params
  const { price, message } = await req.json()

  if (!price || price <= 0)
    return NextResponse.json({ error: 'السعر المقترح للمشروع مطلوب ويجب أن يكون أكبر من صفر' }, { status: 400 })

  const project = await prisma.projectPost.findUnique({ where: { id: projectId } })
  if (!project) return NextResponse.json({ error: 'المشروع غير موجود' }, { status: 404 })
  if (project.status !== 'OPEN')
    return NextResponse.json({ error: 'هذا المشروع مغلق ولا يقبل عروضاً جديدة' }, { status: 400 })

  const profile = await prisma.photographerProfile.findUnique({
    where: { userId: session.user.id },
  })
  if (!profile) return NextResponse.json({ error: 'الملف الشخصي غير موجود' }, { status: 404 })

  // Subscription guard — returns 402 if not ACTIVE
  const guard = await assertActivePhotographer(session.user.id)
  if (guard) return guard

  // Check if already bid
  const existingBid = await prisma.bid.findUnique({
    where: { projectId_photographerId: { projectId, photographerId: profile.id } },
  })
  if (existingBid)
    return NextResponse.json({ error: 'لقد قدمت عرضاً على هذا المشروع مسبقاً' }, { status: 400 })

  const bid = await prisma.bid.create({
    data: {
      projectId,
      photographerId: profile.id,
      price: parseFloat(price),
      message: message?.trim() ?? null,
    },
    include: {
      photographer: {
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      },
    },
  })

  // Auto-create a conversation linked to this project bid
  const conversationId = await getOrCreateProjectBidConversation(
    projectId,
    project.consumerId,
    profile.id
  )

  return NextResponse.json({ ...bid, conversationId }, { status: 201 })
}
