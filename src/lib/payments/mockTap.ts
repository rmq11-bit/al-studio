/**
 * Mock Payment Provider
 *
 * Used in development (TAP_MODE=mock, the default).
 * No network calls — payment is "approved" when the DEV webhook button is pressed.
 *
 * Mock webhook secret:
 *   Set MOCK_WEBHOOK_SECRET in .env.local (optional — defaults to "DEV_MOCK_SECRET").
 *   The success page DEV button sends this same value.
 */

import type {
  PaymentProvider,
  CheckoutParams,
  CheckoutResult,
  WebhookPayload,
} from './provider'

// ---------------------------------------------------------------------------
// Secret used to authenticate mock webhook calls.
// Override via MOCK_WEBHOOK_SECRET in .env.local if desired.
// ---------------------------------------------------------------------------
const MOCK_SECRET = process.env.MOCK_WEBHOOK_SECRET ?? 'DEV_MOCK_SECRET'

export const mockTapProvider: PaymentProvider = {
  name: 'mock',

  /**
   * In mock mode we skip the real payment gateway entirely.
   * The "checkout" is an instant redirect to the success page with the intentId.
   * The payment is considered confirmed only after the DEV webhook button is pressed.
   */
  async createCheckout(params: CheckoutParams): Promise<CheckoutResult> {
    return {
      // Redirect straight to the success landing page; intentId travels as query param.
      checkoutUrl: `${params.successUrl}?intentId=${params.intentId}`,
    }
  },

  /**
   * Mock webhook verification.
   * Expected body: { intentId: string, mockSecret: string, status?: "SUCCESS" | "FAILED" }
   * Rejects if mockSecret doesn't match MOCK_SECRET.
   */
  parseWebhook(rawBody: string, _headers: Record<string, string>): WebhookPayload {
    let body: Record<string, unknown>
    try {
      body = JSON.parse(rawBody)
    } catch {
      throw new Error('Invalid JSON in mock webhook body')
    }

    if (body.mockSecret !== MOCK_SECRET) {
      throw new Error('Invalid mock webhook secret')
    }

    if (!body.intentId || typeof body.intentId !== 'string') {
      throw new Error('Missing or invalid intentId in mock webhook body')
    }

    // Default to SUCCESS unless caller explicitly sends FAILED
    const status: 'SUCCESS' | 'FAILED' =
      body.status === 'FAILED' ? 'FAILED' : 'SUCCESS'

    return { intentId: body.intentId, status }
  },
}
