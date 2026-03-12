import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const projects = await prisma.projectPost.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      hours: true,
      status: true,
      createdAt: true,
      consumer: {
        select: { name: true, email: true },
      },
      _count: {
        select: { bids: true },
      },
    },
  })

  return NextResponse.json(projects)
}
