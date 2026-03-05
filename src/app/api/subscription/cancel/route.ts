import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(_req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'PHOTOGRAPHER')
    return NextResponse.json({ error: 'فقط المصورون يمكنهم إلغاء الاشتراك' }, { status: 403 })

  const profile = await prisma.photographerProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, subscriptionStatus: true, subscriptionExpiresAt: true },
  })

  if (!profile)
    return NextResponse.json({ error: 'الملف الشخصي غير موجود' }, { status: 404 })

  // Only ACTIVE subscriptions can be canceled (CANCELED is idempotent)
  if (!['ACTIVE', 'CANCELED'].includes(profile.subscriptionStatus)) {
    return NextResponse.json(
      { error: 'لا يوجد اشتراك نشط لإلغائه', code: 'SUBSCRIPTION_NOT_ACTIVE' },
      { status: 400 },
    )
  }

  // Idempotent: already canceled — return current state
  if (profile.subscriptionStatus === 'CANCELED') {
    return NextResponse.json({
      ok: true,
      subscriptionStatus: 'CANCELED',
      subscriptionExpiresAt: profile.subscriptionExpiresAt,
    })
  }

  // Real Tap mode: cancel via gateway first (stub — wire when Tap is live)
  const tapMode = process.env.TAP_MODE ?? 'mock'
  if (tapMode !== 'mock') {
    return NextResponse.json(
      { error: 'إلغاء الاشتراك عبر Tap غير مفعّل بعد' },
      { status: 501 },
    )
  }

  // Mock mode: mark CANCELED, keep existing expiresAt or default to now + 30 days
  const now = new Date()
  const existingExpiry = profile.subscriptionExpiresAt
  const effectiveExpiry =
    existingExpiry && existingExpiry > now
      ? existingExpiry
      : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const updated = await prisma.photographerProfile.update({
    where: { id: profile.id },
    data: {
      subscriptionStatus: 'CANCELED',
      subscriptionCanceledAt: now,
      subscriptionExpiresAt: effectiveExpiry,
    },
    select: {
      subscriptionStatus: true,
      subscriptionExpiresAt: true,
    },
  })

  return NextResponse.json({
    ok: true,
    subscriptionStatus: updated.subscriptionStatus,
    subscriptionExpiresAt: updated.subscriptionExpiresAt,
  })
}
