import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'PHOTOGRAPHER')
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const profile = await prisma.photographerProfile.findUnique({
    where: { userId: session.user.id },
  })
  if (!profile) return NextResponse.json({ error: 'الملف الشخصي غير موجود' }, { status: 404 })

  const { date } = await req.json()
  if (!date) return NextResponse.json({ error: 'التاريخ مطلوب' }, { status: 400 })

  // Toggle availability
  const existing = await prisma.availability.findUnique({
    where: { photographerId_date: { photographerId: profile.id, date } },
  })

  if (existing) {
    if (existing.status === 'AVAILABLE') {
      await prisma.availability.update({
        where: { id: existing.id },
        data: { status: 'UNAVAILABLE' },
      })
      return NextResponse.json({ date, status: 'UNAVAILABLE' })
    } else {
      await prisma.availability.update({
        where: { id: existing.id },
        data: { status: 'AVAILABLE' },
      })
      return NextResponse.json({ date, status: 'AVAILABLE' })
    }
  } else {
    const avail = await prisma.availability.create({
      data: { photographerId: profile.id, date, status: 'AVAILABLE' },
    })
    return NextResponse.json(avail, { status: 201 })
  }
}
