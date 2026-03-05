import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { photographerProfile: true },
  })
  return NextResponse.json(user)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const body = await req.json()
  const { name, bio, avatarUrl, hourlyRate, specialties, location } = body

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name ? { name: name.trim() } : {}),
      ...(bio !== undefined ? { bio } : {}),
      ...(avatarUrl !== undefined ? { avatarUrl } : {}),
    },
  })

  if (session.user.role === 'PHOTOGRAPHER') {
    await prisma.photographerProfile.update({
      where: { userId: session.user.id },
      data: {
        ...(hourlyRate !== undefined ? { hourlyRate: parseFloat(hourlyRate) } : {}),
        ...(specialties ? { specialties: JSON.stringify(specialties) } : {}),
        ...(location !== undefined ? { location } : {}),
      },
    })
  }

  return NextResponse.json({ success: true, name: updatedUser.name })
}
