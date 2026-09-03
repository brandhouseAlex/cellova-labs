/**
 * Provider-independent payment abstraction.
 *
 * Tagada Pay (or any other processor) will be attached later by
 * implementing this contract. The checkout UI only talks to these
 * types — never to a processor SDK directly.
 *
 * Security rules that any future integration must follow:
 *   - Never store raw credit-card numbers, CVCs, or bank details here.
 *   - Never expose private payment API credentials client-side.
 *   - All status changes must be confirmable via server-side webhooks.
 *   - All mutations must be idempotent (safe to retry).
 */

export type PaymentStatus =
  | "idle"
  | "requires_payment_method"
  | "requires_action" // e.g. 3DS / additional customer action
  | "processing"
  | "authorized"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partially_refunded";

export interface PaymentError {
  code: string;
  message: string;
  /** Whether the customer can retry with the same details. */
  retryable: boolean;
}

export interface PaymentInitInput {
  /** The commerce cart being paid for. */
  cartId: string;
  /** Idempotency key generated once per checkout attempt. */
  idempotencyKey: string;
  /** Customer email for receipts. */
  email?: string;
}

export interface PaymentSession {
  /** Provider-side payment/session identifier. */
  id: string;
  status: PaymentStatus;
  /** Client secret or token used by the provider's secure element. */
  clientToken?: string;
  /** Redirect URL when the provider uses hosted pages or 3DS. */
  redirectUrl?: string;
}

/**
 * Contract a payment provider adapter must satisfy. The future
 * Tagada Pay adapter will live at lib/payments/providers/tagada/.
 */
export interface PaymentProviderAdapter {
  readonly name: string;

  /** Initialize a payment session for a cart. */
  initialize(input: PaymentInitInput): Promise<PaymentSession>;

  /** Check the current status of a payment session. */
  getStatus(sessionId: string): Promise<PaymentStatus>;

  /**
   * Confirm/authorize after the customer completes any required
   * action (e.g. 3DS). Must be idempotent.
   */
  confirm(sessionId: string): Promise<PaymentSession>;
}
