import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const projects = await prisma.projectPost.findMany({
    where: { status: 'OPEN' },
    include: {
      consumer: { select: { id: true, name: true, avatarUrl: true } },
      bids: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(projects)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'CONSUMER')
    return NextResponse.json({ error: 'فقط العملاء يمكنهم نشر مشاريع' }, { status: 403 })

  const { title, description, hours } = await req.json()

  if (!title?.trim()) return NextResponse.json({ error: 'عنوان المشروع مطلوب' }, { status: 400 })
  if (!description?.trim()) return NextResponse.json({ error: 'وصف المشروع مطلوب' }, { status: 400 })
  if (!hours || hours <= 0) return NextResponse.json({ error: 'عدد الساعات يجب أن يكون أكبر من صفر' }, { status: 400 })

  const project = await prisma.projectPost.create({
    data: {
      consumerId: session.user.id,
      title: title.trim(),
      description: description.trim(),
      hours: parseFloat(hours),
      status: 'OPEN',
    },
  })

  return NextResponse.json(project, { status: 201 })
}
