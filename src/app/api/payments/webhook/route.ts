/**
 * POST /api/payments/webhook
 *
 * Receives provider callbacks (real Tap) or simulated DEV webhooks (mock).
 *
 * ── Idempotency ──────────────────────────────────────────────────────────────
 * If the PaymentIntent is already SUCCESS, the handler is a no-op.
 * Safe to call multiple times with the same payload.
 *
 * ── Mock mode ────────────────────────────────────────────────────────────────
 * Accepts: { intentId: string, mockSecret: string, status?: "SUCCESS"|"FAILED" }
 * mockSecret must match MOCK_WEBHOOK_SECRET env var (default: "DEV_MOCK_SECRET").
 *
 * ── Real Tap mode ─────────────────────────────────────────────────────────────
 * Tap sends a signed POST. Signature verified via TAP_WEBHOOK_SECRET (see tap.ts).
 * TODO: Register this URL in Tap Dashboard → Developers → Webhooks:
 *   https://yourdomain.sa/api/payments/webhook
 *
 * ── On SUCCESS ───────────────────────────────────────────────────────────────
 *  1. Update PaymentIntent.status → SUCCESS
 *  2. Set PhotographerProfile.subscriptionStatus = "ACTIVE", expiresAt = +30 days
 *  3. Upsert a SubscriptionTransaction row (providerTransactionId = intentId)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPaymentProvider } from '@/lib/payments'
import type { WebhookPayload } from '@/lib/payments'

export async function POST(req: NextRequest) {
  // Read raw body as text — required for HMAC signature verification (real Tap)
  const rawBody = await req.text()

  // Collect headers as a plain object (lowercased) for signature verification
  const headers: Record<string, string> = {}
  req.headers.forEach((value, key) => { headers[key] = value })

  // ── Parse + verify webhook via active provider ─────────────────────────────
  const provider = getPaymentProvider()
  let payload: WebhookPayload
  try {
    payload = provider.parseWebhook(rawBody, headers)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Webhook parse / verification failed'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  // ── Look up PaymentIntent ──────────────────────────────────────────────────
  const intent = await prisma.paymentIntent.findUnique({
    where: { id: payload.intentId },
  })
  if (!intent) {
    return NextResponse.json(
      { error: `PaymentIntent not found: ${payload.intentId}` },
      { status: 404 }
    )
  }

  // ── Idempotency: already processed → short-circuit ────────────────────────
  if (intent.status === 'SUCCESS') {
    return NextResponse.json({ ok: true, message: 'Already processed' })
  }

  // ── Update PaymentIntent status ────────────────────────────────────────────
  await prisma.paymentIntent.update({
    where: { id: intent.id },
    data: {
      status: payload.status,
      ...(payload.externalId ? { externalId: payload.externalId } : {}),
    },
  })

  // ── On SUCCESS: activate subscription + record transaction ─────────────────
  if (payload.status === 'SUCCESS') {
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days

    // Activate photographer subscription
    await prisma.photographerProfile.update({
      where: { id: intent.photographerId },
      data: {
        subscriptionStatus: 'ACTIVE',
        subscriptionExpiresAt: expiresAt,
      },
    })

    // Upsert SubscriptionTransaction (idempotent via providerTransactionId = intentId)
    const existingTx = await prisma.subscriptionTransaction.findFirst({
      where: { providerTransactionId: intent.id },
    })
    if (!existingTx) {
      await prisma.subscriptionTransaction.create({
        data: {
          photographerId: intent.photographerId,
          amount: intent.amountHalalas,
          status: 'SUCCESS',
          provider: intent.provider,
          // Use our own intentId as the stable reference key for idempotency
          providerTransactionId: intent.id,
        },
      })
    }

    return NextResponse.json({
      ok: true,
      subscriptionStatus: 'ACTIVE',
      subscriptionExpiresAt: expiresAt.toISOString(),
    })
  }

  // FAILED path
  return NextResponse.json({ ok: true, status: 'FAILED' })
}
