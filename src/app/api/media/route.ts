import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'PHOTOGRAPHER')
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const profile = await prisma.photographerProfile.findUnique({
    where: { userId: session.user.id },
  })
  if (!profile) return NextResponse.json({ error: 'الملف الشخصي غير موجود' }, { status: 404 })

  const contentType = req.headers.get('content-type') ?? ''

  if (contentType.includes('multipart/form-data')) {
    // File upload
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const caption = formData.get('caption') as string | null

    if (!file) return NextResponse.json({ error: 'لا يوجد ملف' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const ext = file.name.split('.').pop() ?? 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    await writeFile(path.join(uploadsDir, filename), buffer)

    const type = file.type.startsWith('video') ? 'VIDEO' : 'IMAGE'
    const media = await prisma.media.create({
      data: {
        photographerId: profile.id,
        type,
        url: `/uploads/${filename}`,
        caption: caption ?? null,
      },
    })
    return NextResponse.json(media, { status: 201 })
  } else {
    // JSON with URL
    const body = await req.json()
    const { url, type = 'IMAGE', caption } = body
    if (!url) return NextResponse.json({ error: 'الرابط مطلوب' }, { status: 400 })

    const media = await prisma.media.create({
      data: {
        photographerId: profile.id,
        type,
        url,
        caption: caption ?? null,
      },
    })
    return NextResponse.json(media, { status: 201 })
  }
}
