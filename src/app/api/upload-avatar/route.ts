import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('avatar') as File | null

  if (!file) {
    return NextResponse.json({ error: 'لم يتم اختيار صورة' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'يُسمح فقط بملفات الصور (JPG, PNG, WebP, GIF)' },
      { status: 400 },
    )
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: 'حجم الصورة يجب ألا يتجاوز 5 ميغابايت' },
      { status: 400 },
    )
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Save to public/uploads/avatars/ — served as static files by Next.js
  const dir = path.join(process.cwd(), 'public', 'uploads', 'avatars')
  await mkdir(dir, { recursive: true })

  const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase()
  const filename = `${session.user.id}-${Date.now()}.${ext}`
  await writeFile(path.join(dir, filename), buffer)

  const url = `/uploads/avatars/${filename}`

  // Persist to DB immediately so the avatar shows everywhere right away
  await prisma.user.update({
    where: { id: session.user.id },
    data: { avatarUrl: url },
  })

  return NextResponse.json({ url })
}
