import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
      createdAt: true,
      _count: {
        select: {
          sentMessages: true,
          consumerProjects: true,
        },
      },
    },
  })

  return NextResponse.json(users)
}
