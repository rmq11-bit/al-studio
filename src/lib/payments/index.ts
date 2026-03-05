/**
 * Payment Provider Selector (legacy compat layer)
 *
 * Used by the older /api/payments/* routes (provider-interface pattern).
 * The active subscription flow uses src/lib/payments/tap.ts directly via
 * createCheckoutOrIntent() and verifyAndActivateFromWebhook().
 *
 * tap.ts no longer exports a tapProvider object — it exports functions instead.
 * The legacy /api/payments/* routes always run in mock mode via mockTapProvider.
 */

import type { PaymentProvider } from './provider'
import { mockTapProvider } from './mockTap'

export function getPaymentProvider(): PaymentProvider {
  // tap.ts now uses a direct function-based API; legacy routes always use mock.
  return mockTapProvider
}

// Re-export types so callers can import from '@/lib/payments'
export type { PaymentProvider, CheckoutParams, CheckoutResult, WebhookPayload } from './provider'
