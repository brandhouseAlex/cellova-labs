"use client";

import { useCart } from "@/lib/auth/cart-store";

/** A global, live-count launcher for the existing cart drawer. */
export function StickyCartLauncher() {
  const { cart, openDrawer } = useCart();
  const quantity = cart?.totalQuantity ?? 0;

  return <button type="button" onClick={openDrawer} aria-label={`Open cart, ${quantity} items`} className="sticky-cart-launcher fixed bottom-5 right-5 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full border border-brand-bright/70 bg-brand text-paper shadow-[0_18px_30px_-16px_rgba(45,52,82,.75)] transition duration-200 hover:bg-brand-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-bright active:scale-[.97] sm:bottom-6 sm:right-6">
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 7h12l1.5 13.5a1 1 0 0 1-1 1.1H5.5a1 1 0 0 1-1-1.1L6 7Z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></svg>
  </button>;
}
