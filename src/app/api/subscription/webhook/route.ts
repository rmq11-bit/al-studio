/**
 * POST /api/subscription/webhook
 *
 * Handles two payload formats — detected automatically:
 *
 * ── Format A: Payment flow (new) ────────────────────────────────────────────
 *   { intentId: string, mockSecret: string, status?: "SUCCESS"|"FAILED" }
 *   Used by: /pricing/success DEV button (mock mode), and real Tap (production).
 *   Routes through verifyAndActivateFromWebhook() in tap.ts.
 *   Idempotent: calling twice with the same intentId is a no-op.
 *
 * ── Format B: Direct simulator (legacy) ─────────────────────────────────────
 *   { photographerId: string, status: string, amount: number, provider: string }
 *   Used by: DevSubscriptionSimulator on the photographer dashboard.
 *   Kept for backward compatibility — does NOT go through tap.ts.
 *
 * ── Real Tap (production) ────────────────────────────────────────────────────
 *   Format A is used. Tap sends its signed payload; tap.ts verifies the signature.
 *   Register this URL in Tap Dashboard → Developers → Webhooks:
 *     https://yourdomain.sa/api/subscription/webhook
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAndActivateFromWebhook } from '@/lib/payments/tap'

const IS_DEV = process.env.NODE_ENV === 'development'

function devMsg(error: unknown, status = 500) {
  const msg = error instanceof Error ? error.message : String(error)
  return NextResponse.json(
    { error: IS_DEV ? msg : 'حدث خطأ داخلي في الخادم' },
    { status },
  )
}

export async function POST(req: NextRequest) {
  // Read raw body once — needed for HMAC verification in real Tap mode
  const rawBody = await req.text()

  // Collect headers for tap.ts signature verification
  const headers: Record<string, string> = {}
  req.headers.forEach((v, k) => { headers[k] = v })

  // ── Detect payload format ──────────────────────────────────────────────────
  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // ── Format A: intentId-based (new payment flow) ────────────────────────────
  if (parsed.intentId) {
    try {
      const result = await verifyAndActivateFromWebhook(rawBody, headers)

      if (result.status === 'ALREADY_ACTIVE') {
        return NextResponse.json({ ok: true, message: 'Already processed' })
      }
      if (result.status === 'FAILED') {
        return NextResponse.json({ ok: true, status: 'FAILED' })
      }
      // ACTIVATED
      return NextResponse.json({
        ok: true,
        status: 'ACTIVATED',
        subscriptionExpiresAt: result.subscriptionExpiresAt?.toISOString(),
      })
    } catch (err) {
      return devMsg(err, 400)
    }
  }

  // ── Format B: direct photographerId (DevSubscriptionSimulator — legacy) ────
  if (parsed.photographerId) {
    return handleLegacyFormat(parsed)
  }

  return NextResponse.json(
    { error: 'Unrecognised payload: expected intentId or photographerId' },
    { status: 400 },
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Legacy handler — kept so DevSubscriptionSimulator on the dashboard still works.
// Original logic untouched.
// ─────────────────────────────────────────────────────────────────────────────
async function handleLegacyFormat(body: Record<string, unknown>) {
  const IS_DEV = process.env.NODE_ENV === 'development'

  function devError(error: unknown, status = 500) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: IS_DEV ? message : 'حدث خطأ داخلي في الخادم' },
      { status },
    )
  }

  try {
    const { photographerId, amount, status, provider, providerTransactionId } = body as {
      photographerId: string
      amount?: number
      status: string
      provider: string
      providerTransactionId?: string
    }

    if (!photographerId || !status || !provider) {
      return NextResponse.json(
        { error: 'الحقول المطلوبة غير مكتملة: photographerId, status, provider' },
        { status: 400 },
      )
    }

    const validStatuses = ['PENDING', 'SUCCESS', 'FAILED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `قيمة status غير صالحة. المسموح به: ${validStatuses.join(', ')}` },
        { status: 400 },
      )
    }

    if (amount !== undefined && (!Number.isInteger(amount) || amount <= 0)) {
      return NextResponse.json(
        { error: 'amount يجب أن يكون عدداً صحيحاً موجباً (بالهللة)' },
        { status: 400 },
      )
    }

    let profile
    try {
      profile = await prisma.photographerProfile.findUnique({ where: { id: photographerId } })
    } catch (err) {
      console.error('[webhook/legacy] prisma.findUnique error:', err)
      return devError(err)
    }

    if (!profile) {
      return NextResponse.json({ error: 'لم يتم العثور على ملف المصور' }, { status: 404 })
    }

    let transaction
    try {
      transaction = await prisma.subscriptionTransaction.create({
        data: {
          photographerId,
          amount: amount ?? 0,
          status,
          provider,
          providerTransactionId: providerTransactionId ?? null,
        },
      })
    } catch (err) {
      console.error('[webhook/legacy] prisma.subscriptionTransaction.create error:', err)
      return devError(err)
    }

    if (status === 'SUCCESS') {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      try {
        await prisma.photographerProfile.update({
          where: { id: photographerId },
          data: { subscriptionStatus: 'ACTIVE', subscriptionExpiresAt: expiresAt },
        })
      } catch (err) {
        console.error('[webhook/legacy] prisma.photographerProfile.update error:', err)
        return devError(err)
      }
      return NextResponse.json({
        success: true,
        transactionId: transaction.id,
        subscriptionStatus: 'ACTIVE',
        subscriptionExpiresAt: expiresAt.toISOString(),
        message: 'تم تفعيل الاشتراك بنجاح',
      })
    }

    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
      subscriptionStatus: profile.subscriptionStatus,
      message: `تم تسجيل المعاملة بحالة: ${status}`,
    })
  } catch (error) {
    console.error('[webhook/legacy] unhandled error:', error)
    const IS_DEV = process.env.NODE_ENV === 'development'
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: IS_DEV ? msg : 'حدث خطأ داخلي في الخادم' },
      { status: 500 },
    )
  }
}
