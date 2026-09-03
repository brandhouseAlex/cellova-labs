"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PaymentError, PaymentStatus } from "@/lib/payments/types";

/**
 * Generic, provider-independent payment UI.
 *
 * These components define the checkout payment contract that Tagada Pay
 * will later attach to. No processor SDK is imported here, and no raw
 * card data is ever collected or stored by this codebase — a real
 * integration renders the processor's secure fields inside
 * <PaymentElement />.
 */

interface PaymentContextValue {
  status: PaymentStatus;
  error: PaymentError | null;
  setStatus: (s: PaymentStatus) => void;
  setError: (e: PaymentError | null) => void;
}

const PaymentContext = createContext<PaymentContextValue | null>(null);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [error, setError] = useState<PaymentError | null>(null);

  const value = useMemo(
    () => ({ status, error, setStatus, setError }),
    [status, error]
  );

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
}

export function usePayment(): PaymentContextValue {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error("usePayment must be used within <PaymentProvider>");
  return ctx;
}

/**
 * Placeholder secure payment element. When Tagada Pay is integrated, its
 * hosted fields / secure element mount here. Raw card details must never
 * be collected by this application directly.
 */
export function PaymentElement() {
  return (
    <div className="border border-dashed border-line bg-mist p-6 text-center">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="mx-auto h-8 w-8 text-silver"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18M7 15h4" />
      </svg>
      <p className="mt-3 text-sm font-medium text-ink">
        Secure Payment Element
      </p>
      <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-slate">
        A PCI-compliant payment element (Tagada Pay) mounts here at launch.
        Card details are entered into the processor&apos;s secure fields and
        never touch Cellova Labs servers.
      </p>
    </div>
  );
}

export function PaymentStatusMessage() {
  const { status } = usePayment();
  if (status === "idle" || status === "requires_payment_method") return null;

  const messages: Partial<Record<PaymentStatus, string>> = {
    requires_action: "Additional verification is required to complete payment.",
    processing: "Processing your payment…",
    authorized: "Payment authorized.",
    succeeded: "Payment completed successfully.",
    failed: "Payment failed. Please try again.",
    cancelled: "Payment was cancelled.",
  };

  const message = messages[status];
  if (!message) return null;

  return (
    <p
      role="status"
      className="mt-3 border border-line bg-mist px-4 py-2.5 text-sm text-slate"
    >
      {message}
    </p>
  );
}

export function PaymentErrorMessage() {
  const { error } = usePayment();
  if (!error) return null;
  return (
    <p
      role="alert"
      className="mt-3 border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700"
    >
      {error.message}
      {error.retryable ? " You may retry with the same details." : ""}
    </p>
  );
}
