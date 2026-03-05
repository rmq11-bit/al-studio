import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const project = await prisma.projectPost.findUnique({
    where: { id },
    include: {
      consumer: { select: { id: true, name: true, avatarUrl: true } },
      bids: {
        include: {
          photographer: {
            include: { user: { select: { id: true, name: true, avatarUrl: true } } },
          },
        },
        orderBy: { price: 'asc' },
      },
    },
  })

  if (!project) return NextResponse.json({ error: 'المشروع غير موجود' }, { status: 404 })
  return NextResponse.json(project)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== 'CONSUMER')
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const { id } = await params
  const { status } = await req.json()

  const project = await prisma.projectPost.findUnique({ where: { id } })
  if (!project) return NextResponse.json({ error: 'المشروع غير موجود' }, { status: 404 })
  if (project.consumerId !== session.user.id)
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const updated = await prisma.projectPost.update({
    where: { id },
    data: { status },
  })
  return NextResponse.json(updated)
}
