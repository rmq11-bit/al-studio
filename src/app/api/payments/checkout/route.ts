/**
 * POST /api/payments/checkout
 *
 * Creates a PaymentIntent in the DB and asks the active provider for a checkout URL.
 * The client redirects the user to that URL to complete payment.
 *
 * Auth:   Required (session must exist)
 * Input:  { plan?: string }  — defaults to "photographer_monthly"
 * Output: { checkoutUrl: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getPaymentProvider } from '@/lib/payments'

// ─── Supported plans ────────────────────────────────────────────────────────
// TODO: Move this to a shared config file when more plans are added.
const PLANS: Record<string, { amountHalalas: number; currency: string }> = {
  photographer_monthly: { amountHalalas: 4900, currency: 'SAR' }, // 49.00 SAR
}

export async function POST(req: NextRequest) {
  // ── Auth guard ─────────────────────────────────────────────────────────────
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  // ── Parse + validate input ─────────────────────────────────────────────────
  let plan = 'photographer_monthly'
  try {
    const body = await req.json()
    if (body.plan) plan = String(body.plan)
  } catch {
    // No body / not JSON — use default plan
  }

  const planConfig = PLANS[plan]
  if (!planConfig) {
    return NextResponse.json({ error: `خطة غير معروفة: ${plan}` }, { status: 400 })
  }

  // ── Resolve photographer profile ───────────────────────────────────────────
  const profile = await prisma.photographerProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  })
  if (!profile) {
    return NextResponse.json(
      { error: 'ملف المصور غير موجود. أكمل التسجيل أولاً.' },
      { status: 404 }
    )
  }

  // ── Determine base URL for redirect targets ────────────────────────────────
  // TODO: Set APP_URL=https://yourdomain.sa in production .env
  const appUrl =
    process.env.APP_URL ??
    `${req.nextUrl.protocol}//${req.nextUrl.host}`

  const provider = getPaymentProvider()

  // ── Create PaymentIntent row ───────────────────────────────────────────────
  const intent = await prisma.paymentIntent.create({
    data: {
      userId: session.user.id,
      photographerId: profile.id,
      plan,
      provider: provider.name,
      amountHalalas: planConfig.amountHalalas,
      currency: planConfig.currency,
      status: 'PENDING',
    },
  })

  // ── Ask provider for checkout URL ──────────────────────────────────────────
  let result: { checkoutUrl: string; externalId?: string }
  try {
    result = await provider.createCheckout({
      intentId: intent.id,
      userId: session.user.id,
      photographerId: profile.id,
      plan,
      amountHalalas: planConfig.amountHalalas,
      currency: planConfig.currency,
      successUrl: `${appUrl}/pricing/success`,
      failUrl: `${appUrl}/pricing/failed`,
    })
  } catch (err) {
    // Mark intent as failed so it doesn't dangle as PENDING
    await prisma.paymentIntent.update({
      where: { id: intent.id },
      data: { status: 'FAILED' },
    })
    const msg = err instanceof Error ? err.message : 'Payment provider error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  // ── Persist externalId if provider returned one ────────────────────────────
  if (result.externalId) {
    await prisma.paymentIntent.update({
      where: { id: intent.id },
      data: { externalId: result.externalId },
    })
  }

  return NextResponse.json({ checkoutUrl: result.checkoutUrl })
}
