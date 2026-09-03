import type {
  PaymentInitInput,
  PaymentProviderAdapter,
  PaymentSession,
  PaymentStatus,
} from "@/lib/payments/types";

/**
 * Mock payment provider.
 *
 * Simulates a successful authorization so the checkout flow can be
 * demonstrated end-to-end without a real processor. Replace with the
 * Tagada Pay adapter at lib/payments/providers/tagada/ when credentials
 * and API documentation are available.
 */
export const mockPaymentProvider: PaymentProviderAdapter = {
  name: "mock",

  async initialize(input: PaymentInitInput): Promise<PaymentSession> {
    return {
      id: `pay_${input.idempotencyKey}`,
      status: "requires_payment_method",
    };
  },

  async getStatus(_sessionId: string): Promise<PaymentStatus> {
    return "succeeded";
  },

  async confirm(sessionId: string): Promise<PaymentSession> {
    return { id: sessionId, status: "succeeded" };
  },
};
