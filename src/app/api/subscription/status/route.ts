/**
 * GET /api/subscription/status?intentId=...
 *
 * Returns the current status of a PaymentIntent.
 * Polled every 2 s by /pricing/success until status is SUCCESS or FAILED.
 *
 * Auth:   Required — users may only query their own intents.
 * Output: { intentId, status: "PENDING"|"SUCCESS"|"FAILED", plan, provider }
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
  }

  // ── intentId ──────────────────────────────────────────────────────────────
  const intentId = req.nextUrl.searchParams.get('intentId')
  if (!intentId) {
    return NextResponse.json({ error: 'intentId مطلوب' }, { status: 400 })
  }

  // ── Lookup ────────────────────────────────────────────────────────────────
  const intent = await prisma.paymentIntent.findUnique({
    where: { id: intentId },
    select: {
      id:            true,
      userId:        true,
      status:        true,
      plan:          true,
      provider:      true,
      amountHalalas: true,
      currency:      true,
    },
  })

  if (!intent) {
    return NextResponse.json({ error: 'PaymentIntent غير موجود' }, { status: 404 })
  }

  // ── Ownership ─────────────────────────────────────────────────────────────
  if (intent.userId !== session.user.id) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  }

  return NextResponse.json({
    intentId: intent.id,
    status:        intent.status,   // PENDING | SUCCESS | FAILED
    plan:          intent.plan,
    provider:      intent.provider,
    amountHalalas: intent.amountHalalas,
    currency:      intent.currency,
  })
}
