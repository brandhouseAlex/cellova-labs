import type { PaymentProviderAdapter } from "./types";
import { mockPaymentProvider } from "./providers/mock";

/**
 * Payment entry point. The active payment provider is selected with
 * PAYMENT_PROVIDER (default: "mock"). When Tagada Pay credentials are
 * available, implement lib/payments/providers/tagada/ and set
 * PAYMENT_PROVIDER=tagada.
 */
function resolvePaymentProvider(): PaymentProviderAdapter {
  const name = (process.env.PAYMENT_PROVIDER ?? "mock").toLowerCase();
  switch (name) {
    // case "tagada":
    //   return tagadaPaymentProvider;
    case "mock":
    default:
      return mockPaymentProvider;
  }
}

export const payments: PaymentProviderAdapter = resolvePaymentProvider();
export * from "./types";
