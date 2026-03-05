/**
 * src/lib/payments/tap.ts
 *
 * Central payments module. Handles both mock and real Tap modes.
 * Switch between them with the TAP_MODE environment variable.
 *
 * ─── Environment variables ───────────────────────────────────────────────────
 *   TAP_MODE=mock              (default — no credentials needed)
 *   TAP_MODE=tap               (production — requires the vars below)
 *   TAP_SECRET_KEY=sk_live_... (Tap Dashboard → Developers → API Keys)
 *   TAP_WEBHOOK_SECRET=...     (Tap Dashboard → Developers → Webhooks → Secret)
 *   APP_URL=https://domain.sa  (full public URL for redirect + webhook targets)
 *   MOCK_WEBHOOK_SECRET=...    (optional override for dev secret; default: DEV_MOCK_SECRET)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * To go live: fill in the two TODO blocks below and set TAP_MODE=tap.
 * No other files need changing.
 */

import { prisma } from '@/lib/prisma'

const TAP_MODE = process.env.TAP_MODE ?? 'mock'
// Secret that the DEV success-page button must send to authenticate mock webhooks
const MOCK_SECRET = process.env.MOCK_WEBHOOK_SECRET ?? 'DEV_MOCK_SECRET'

// ─── Plan catalogue ──────────────────────────────────────────────────────────
const PLANS: Record<string, { amountHalalas: number; currency: string }> = {
  photographer_monthly: { amountHalalas: 4900, currency: 'SAR' }, // 49.00 SAR
}

// ─── Return types ────────────────────────────────────────────────────────────
export interface CheckoutResult {
  /** URL to redirect the user to (mock → /pricing/success, real → Tap hosted page) */
  redirectUrl: string
  /** Our internal PaymentIntent.id — passed as query param to success page */
  intentId: string
}

export type ActivationStatus = 'ACTIVATED' | 'ALREADY_ACTIVE' | 'FAILED'

export interface ActivationResult {
  intentId: string
  status: ActivationStatus
  subscriptionExpiresAt?: Date
}

// ─────────────────────────────────────────────────────────────────────────────
// createCheckoutOrIntent
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Start a checkout session for `plan` on behalf of `userId`.
 *
 * 1. Resolves the photographer profile for the logged-in user.
 * 2. Creates a PENDING PaymentIntent in the DB.
 * 3. In mock mode  → returns local success URL immediately (no real payment).
 *    In Tap mode   → calls Tap API to create a hosted charge, returns Tap URL.
 *
 * @param plan       Plan key, e.g. "photographer_monthly"
 * @param userId     session.user.id of the logged-in user
 * @param appBaseUrl e.g. "http://localhost:3000" or "https://yourdomain.sa"
 */
export async function createCheckoutOrIntent(
  plan: string,
  userId: string,
  appBaseUrl: string,
): Promise<CheckoutResult> {
  const planConfig = PLANS[plan]
  if (!planConfig) throw new Error(`Unknown plan: ${plan}`)

  // Resolve photographer profile
  const profile = await prisma.photographerProfile.findUnique({
    where: { userId },
    select: { id: true },
  })
  if (!profile) {
    throw new Error('ملف المصور غير موجود. أكمل التسجيل أولاً.')
  }

  // Create PENDING PaymentIntent
  const intent = await prisma.paymentIntent.create({
    data: {
      userId,
      photographerId: profile.id,
      plan,
      provider: TAP_MODE === 'tap' ? 'tap' : 'mock',
      amountHalalas: planConfig.amountHalalas,
      currency: planConfig.currency,
      status: 'PENDING',
    },
  })

  // ── Mock mode ────────────────────────────────────────────────────────────
  if (TAP_MODE !== 'tap') {
    // Skip the real payment gateway — the success page DEV button acts as the webhook.
    return {
      redirectUrl: `${appBaseUrl}/pricing/success?intentId=${intent.id}`,
      intentId: intent.id,
    }
  }

  // ── TODO (Real Tap) ──────────────────────────────────────────────────────
  // Uncomment and fill in when TAP_SECRET_KEY is available.
  //
  // const secretKey = process.env.TAP_SECRET_KEY!
  // const webhookUrl = `${appBaseUrl}/api/subscription/webhook`
  // const successUrl = `${appBaseUrl}/pricing/success?intentId=${intent.id}`
  //
  // const res = await fetch('https://api.tap.company/v2/charges', {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${secretKey}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     amount: planConfig.amountHalalas / 100,   // Tap expects SAR (e.g. 49.00)
  //     currency: planConfig.currency,
  //     reference: { transaction: intent.id },    // our intentId stored as metadata
  //     source:   { id: 'src_all' },              // show all Tap payment methods
  //     redirect: { url: successUrl },
  //     post:     { url: webhookUrl },            // Tap will POST here after payment
  //   }),
  // })
  // const data = await res.json()
  // if (!res.ok) {
  //   await prisma.paymentIntent.update({ where: { id: intent.id }, data: { status: 'FAILED' } })
  //   throw new Error(`Tap API error: ${data.errors?.[0]?.description ?? JSON.stringify(data)}`)
  // }
  //
  // // Persist Tap's own charge ID for cross-reference
  // await prisma.paymentIntent.update({
  //   where: { id: intent.id },
  //   data:  { externalId: data.id },
  // })
  //
  // return { redirectUrl: data.transaction.url, intentId: intent.id }
  // ────────────────────────────────────────────────────────────────────────

  // Mark intent failed so it doesn't sit as PENDING forever
  await prisma.paymentIntent.update({ where: { id: intent.id }, data: { status: 'FAILED' } })
  throw new Error(
    '[Tap] createCheckoutOrIntent: TAP_MODE=tap but the TODO block is not yet implemented. ' +
    'Set TAP_MODE=mock to continue development.',
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// verifyAndActivateFromWebhook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Verify and process a webhook payload, then activate the subscription.
 *
 * Idempotent: if the PaymentIntent is already SUCCESS, returns ALREADY_ACTIVE.
 *
 * Mock mode  — expects body: { intentId, mockSecret, status?: "SUCCESS"|"FAILED" }
 * Tap mode   — expects a signed Tap webhook (hashstring header + Tap JSON body)
 *
 * @param rawBody  Raw UTF-8 request body string (needed for HMAC in real Tap)
 * @param headers  Lowercased request headers (for Tap's 'hashstring' signature)
 */
export async function verifyAndActivateFromWebhook(
  rawBody: string,
  headers: Record<string, string>,
): Promise<ActivationResult> {
  let intentId: string
  let incomingStatus: 'SUCCESS' | 'FAILED' = 'SUCCESS'

  // ── Mock mode ────────────────────────────────────────────────────────────
  if (TAP_MODE !== 'tap') {
    let body: Record<string, unknown>
    try {
      body = JSON.parse(rawBody)
    } catch {
      throw new Error('Invalid JSON body')
    }
    if (body.mockSecret !== MOCK_SECRET) {
      throw new Error('Invalid mock webhook secret')
    }
    if (!body.intentId || typeof body.intentId !== 'string') {
      throw new Error('Missing intentId in webhook body')
    }
    intentId = body.intentId
    incomingStatus = body.status === 'FAILED' ? 'FAILED' : 'SUCCESS'
  } else {
    // ── TODO (Real Tap) ────────────────────────────────────────────────────
    // Verify Tap webhook signature and extract the charge data.
    //
    // const webhookSecret = process.env.TAP_WEBHOOK_SECRET!
    // const { createHmac } = await import('node:crypto')
    //
    // // 1. Verify signature
    // const hash     = headers['hashstring']
    // const expected = createHmac('sha256', webhookSecret).update(rawBody).digest('hex')
    // if (hash !== expected) throw new Error('Invalid Tap webhook signature')
    //
    // // 2. Parse body
    // const tapBody = JSON.parse(rawBody)
    // intentId       = tapBody.reference?.transaction   // id we set in createCheckoutOrIntent
    // incomingStatus = tapBody.status === 'CAPTURED' ? 'SUCCESS' : 'FAILED'
    //
    // // Tap webhook status reference:
    // //   CAPTURED  → payment successful
    // //   DECLINED  → card declined
    // //   CANCELLED → user cancelled
    // //   FAILED    → other failure
    // //
    // // Tap webhook docs: https://developers.tap.company/docs/webhook
    // ──────────────────────────────────────────────────────────────────────

    void headers // suppress unused-var warning until TODO is filled
    throw new Error(
      '[Tap] verifyAndActivateFromWebhook: TAP_MODE=tap but the TODO block is not yet implemented.',
    )
  }

  // ── Shared activation logic (mock + real) ─────────────────────────────────

  const intent = await prisma.paymentIntent.findUnique({ where: { id: intentId } })
  if (!intent) throw new Error(`PaymentIntent not found: ${intentId}`)

  // Idempotency guard
  if (intent.status === 'SUCCESS') {
    return { intentId, status: 'ALREADY_ACTIVE' }
  }

  // Persist final payment status
  await prisma.paymentIntent.update({
    where: { id: intentId },
    data:  { status: incomingStatus },
  })

  if (incomingStatus === 'FAILED') {
    return { intentId, status: 'FAILED' }
  }

  // Activate subscription +30 days from now
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  await prisma.photographerProfile.update({
    where: { id: intent.photographerId },
    data:  { subscriptionStatus: 'ACTIVE', subscriptionExpiresAt: expiresAt },
  })

  // Upsert SubscriptionTransaction — idempotent via providerTransactionId = intentId
  const existingTx = await prisma.subscriptionTransaction.findFirst({
    where: { providerTransactionId: intentId },
  })
  if (!existingTx) {
    await prisma.subscriptionTransaction.create({
      data: {
        photographerId:        intent.photographerId,
        amount:                intent.amountHalalas,
        status:                'SUCCESS',
        provider:              intent.provider,
        providerTransactionId: intentId,
      },
    })
  }

  return { intentId, status: 'ACTIVATED', subscriptionExpiresAt: expiresAt }
}
