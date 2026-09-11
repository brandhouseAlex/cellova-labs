"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/lib/auth/cart-store";
import { ResearchUseNotice } from "@/components/research/research-use-notice";

/**
 * Shopify owns checkout and payment collection. This route retains the
 * existing Cellova page shell only as a safe handoff when opened directly.
 */
export function CheckoutForm() {
  const { cart, isReady, isLoading, error, beginCheckout } = useCart();
  const attempted = useRef(false);

  useEffect(() => {
    if (!isReady || attempted.current || !cart?.items.length) return;
    attempted.current = true;
    void beginCheckout();
  }, [beginCheckout, cart?.items.length, isReady]);

  if (isReady && !cart?.items.length) {
    return (
      <div className="border border-line bg-mist p-12 text-center">
        <p className="font-display text-2xl font-semibold text-ink">Your cart is empty</p>
        <p className="mt-3 text-sm text-slate">Add research materials to your cart before beginning checkout.</p>
        <Link href="/products" className="mt-6 inline-block bg-ink px-8 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-brand-deep">Explore Research Catalog</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl border border-line bg-mist p-8 text-center sm:p-12">
      <p className="font-display text-2xl font-semibold text-ink">Taking you to secure checkout</p>
      <p className="mt-3 text-sm leading-6 text-slate">Your cart and payment are securely handled by Shopify checkout.</p>
      {error ? <p role="alert" className="mt-5 text-sm text-red-700">{error}</p> : null}
      <button type="button" onClick={() => void beginCheckout()} disabled={isLoading || !cart?.items.length} className="mt-6 bg-ink px-8 py-4 text-sm font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50">
        {isLoading ? "Preparing Checkout…" : "Continue to Shopify Checkout"}
      </button>
      <ResearchUseNotice variant="compact" className="mt-6 text-left" />
    </div>
  );
}
