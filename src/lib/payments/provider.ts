/**
 * Payment Provider Abstraction
 *
 * Defines the contract that every payment provider (mock, Tap, etc.) must implement.
 * Swap providers by changing TAP_MODE in your environment without touching call sites.
 */

/** Parameters passed to the provider when creating a hosted checkout session. */
export interface CheckoutParams {
  /** Internal PaymentIntent ID — used as a reference/metadata key with the provider. */
  intentId: string
  userId: string
  photographerId: string
  plan: string
  amountHalalas: number // e.g. 4900 = 49.00 SAR
  currency: string      // e.g. "SAR"
  /** Where to redirect after a successful payment. */
  successUrl: string
  /** Where to redirect after a failed / cancelled payment. */
  failUrl: string
}

/** What the provider returns after creating a checkout session. */
export interface CheckoutResult {
  /** URL to redirect the user to in order to complete payment. */
  checkoutUrl: string
  /** Provider's own session/charge ID — stored on PaymentIntent.externalId (optional). */
  externalId?: string
}

/** Normalised, provider-agnostic webhook payload. */
export interface WebhookPayload {
  /** Our internal PaymentIntent.id, extracted from the raw webhook body. */
  intentId: string
  status: 'SUCCESS' | 'FAILED'
  /** Provider's charge ID — stored on PaymentIntent.externalId (optional). */
  externalId?: string
}

/**
 * A PaymentProvider must implement two methods:
 *  - createCheckout: create a hosted payment session and return the URL.
 *  - parseWebhook:   verify + parse an incoming webhook into a normalised payload.
 *
 * Both methods throw on error; callers wrap them in try/catch.
 */
export interface PaymentProvider {
  /** Human-readable name stored on PaymentIntent.provider. */
  readonly name: string
  createCheckout(params: CheckoutParams): Promise<CheckoutResult>
  /**
   * Verify the webhook signature and return a normalised payload.
   * @param rawBody  Raw UTF-8 request body string (needed for HMAC verification).
   * @param headers  Request headers as a plain object (lowercased keys).
   */
  parseWebhook(rawBody: string, headers: Record<string, string>): WebhookPayload
}
