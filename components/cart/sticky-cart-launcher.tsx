"use client";

import { useCart } from "@/lib/auth/cart-store";

/** A global, live-count launcher for the existing cart drawer. */
export function StickyCartLauncher() {
  const { cart, openDrawer } = useCart();
  const quantity = cart?.totalQuantity ?? 0;

  return <button type="button" onClick={openDrawer} aria-label={`Open cart, ${quantity} items`} className="sticky-cart-launcher fixed bottom-5 right-5 z-[70] inline-flex min-h-12 items-center gap-3 rounded-[7px] border border-[#dce6d4] bg-[#F2A63C] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_-16px_rgba(26,50,12,.85)] transition duration-200 hover:bg-[#3f6919] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8C36A] active:scale-[.97] sm:bottom-6 sm:right-6">
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 7h12l1.5 13.5a1 1 0 0 1-1 1.1H5.5a1 1 0 0 1-1-1.1L6 7Z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></svg>
    <span>Cart</span>
    <span className="sticky-cart-count flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-[#D48624]" aria-hidden="true">{quantity}</span>
  </button>;
}
