import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { assertActivePhotographer } from '@/lib/subscription/requireActivePhotographer'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== 'PHOTOGRAPHER')
    return NextResponse.json({ error: 'فقط المصورون يمكنهم تحديث الطلبات' }, { status: 403 })

  const { id } = await params
  const { status, rejectionNote } = await req.json()

  if (!['APPROVED', 'REJECTED'].includes(status))
    return NextResponse.json({ error: 'الحالة غير صحيحة' }, { status: 400 })

  const request = await prisma.directRequest.findUnique({
    where: { id },
    include: { photographer: true },
  })

  if (!request) return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 })
  if (request.photographer.userId !== session.user.id)
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  // Subscription guard — photographer must be ACTIVE to approve/reject requests
  const guard = await assertActivePhotographer(session.user.id)
  if (guard) return guard

  const updated = await prisma.directRequest.update({
    where: { id },
    data: {
      status,
      rejectionNote: status === 'REJECTED' ? (rejectionNote ?? null) : null,
    },
  })

  return NextResponse.json(updated)
}
