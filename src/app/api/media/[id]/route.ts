import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== 'PHOTOGRAPHER')
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const { id } = await params

  const media = await prisma.media.findUnique({
    where: { id },
    include: { photographer: true },
  })

  if (!media) return NextResponse.json({ error: 'العنصر غير موجود' }, { status: 404 })
  if (media.photographer.userId !== session.user.id)
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  await prisma.media.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
