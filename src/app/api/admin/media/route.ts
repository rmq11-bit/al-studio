import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const media = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true,
      url: true,
      type: true,
      caption: true,
      createdAt: true,
      photographer: {
        select: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
  })

  return NextResponse.json(media)
}
