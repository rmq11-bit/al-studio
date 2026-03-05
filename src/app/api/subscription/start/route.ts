/**
 * POST /api/subscription/start
 *
 * Initiates a subscription checkout for the logged-in photographer.
 * Creates a PENDING PaymentIntent in the DB and returns the URL to redirect to.
 *
 * Auth:   Required (photographer session)
 * Input:  { plan?: string }   — defaults to "photographer_monthly"
 * Output: { redirectUrl: string, intentId: string }
 *
 * Mock mode  → redirectUrl points to /pricing/success?intentId=...
 * Tap mode   → redirectUrl points to Tap hosted checkout page
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createCheckoutOrIntent } from '@/lib/payments/tap'

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
  }

  // ── Plan ──────────────────────────────────────────────────────────────────
  let plan = 'photographer_monthly'
  try {
    const body = await req.json()
    if (typeof body.plan === 'string') plan = body.plan
  } catch {
    // No body or non-JSON → use default plan
  }

  // ── Base URL for redirect targets ─────────────────────────────────────────
  // TODO: set APP_URL=https://yourdomain.sa in production .env
  const appBaseUrl =
    process.env.APP_URL ?? `${req.nextUrl.protocol}//${req.nextUrl.host}`

  // ── Create checkout intent ─────────────────────────────────────────────────
  try {
    const result = await createCheckoutOrIntent(plan, session.user.id, appBaseUrl)
    return NextResponse.json(result) // { redirectUrl, intentId }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء إنشاء جلسة الدفع'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
