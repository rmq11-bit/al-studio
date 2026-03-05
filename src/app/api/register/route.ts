import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, role } = body

    if (!name?.trim()) return NextResponse.json({ error: 'الاسم مطلوب' }, { status: 400 })
    if (!email?.trim()) return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 })
    if (!password || password.length < 6)
      return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }, { status: 400 })
    if (!['PHOTOGRAPHER', 'CONSUMER'].includes(role))
      return NextResponse.json({ error: 'الدور غير صحيح' }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) return NextResponse.json({ error: 'البريد الإلكتروني مسجل مسبقاً' }, { status: 400 })

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role,
        defaultRole: role, // pre-fill so new users skip the role chooser on first login
        ...(role === 'PHOTOGRAPHER'
          ? {
              photographerProfile: {
                create: {
                  hourlyRate: 0,
                  specialties: '[]',
                  isActive: true,
                  subscriptionStatus: 'TRIAL',
                  trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
              },
            }
          : {}),
      },
    })

    return NextResponse.json({ id: user.id, email: user.email, role: user.role }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
