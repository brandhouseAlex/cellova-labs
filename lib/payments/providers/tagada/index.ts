import type {
  PaymentInitInput,
  PaymentProviderAdapter,
  PaymentSession,
  PaymentStatus,
} from "@/lib/payments/types";

/**
 * TAGADA PAY ADAPTER — INTEGRATION POINT
 * ======================================
 *
 * Tagada Pay will be connected here once API credentials and
 * documentation are provided. Implementation checklist:
 *
 *   1. Add server-only environment variables (NEVER NEXT_PUBLIC_*):
 *        TAGADA_API_KEY=...
 *        TAGADA_WEBHOOK_SECRET=...
 *   2. Implement initialize() to create a payment session server-side.
 *   3. Implement confirm() for authorization, including 3DS /
 *      additional-action handling via PaymentStatus "requires_action".
 *   4. Add a webhook route (e.g. app/api/webhooks/tagada/route.ts) that
 *      verifies TAGADA_WEBHOOK_SECRET and drives order status changes.
 *   5. Ensure every mutation sends an idempotency key.
 *   6. Never handle raw card data in this codebase — use Tagada's
 *      secure fields / hosted elements.
 *
 * Then set PAYMENT_PROVIDER=tagada and register the adapter in
 * lib/payments/index.ts.
 */

function notConfigured(): never {
  throw new Error(
    "[payments] Tagada Pay is not yet integrated. " +
      "See lib/payments/providers/tagada/index.ts for integration steps."
  );
}

export const tagadaPaymentProvider: PaymentProviderAdapter = {
  name: "tagada",

  async initialize(_input: PaymentInitInput): Promise<PaymentSession> {
    return notConfigured();
  },
  async getStatus(_sessionId: string): Promise<PaymentStatus> {
    return notConfigured();
  },
  async confirm(_sessionId: string): Promise<PaymentSession> {
    return notConfigured();
  },
};
