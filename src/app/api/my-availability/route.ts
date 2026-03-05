import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== 'PHOTOGRAPHER')
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const profile = await prisma.photographerProfile.findUnique({
    where: { userId: session.user.id },
    include: { availability: { orderBy: { date: 'asc' } } },
  })

  return NextResponse.json(profile?.availability ?? [])
}
