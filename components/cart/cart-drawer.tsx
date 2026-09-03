"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useCart } from "@/lib/auth/cart-store";
import { formatMoney } from "@/lib/utils";
import { ResearchUseNotice } from "@/components/research/research-use-notice";

/** Slide-over cart drawer. Pricing always comes from the provider. */
export function CartDrawer() {
  const { cart, isDrawerOpen, closeDrawer, updateItem, removeItem, isLoading } =
    useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    if (isDrawerOpen) {
      document.addEventListener("keydown", onKey);
      panelRef.current?.focus();
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const items = cart?.items ?? [];

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeDrawer}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/50 backdrop-blur-[2px]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl focus:outline-none"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-lg font-semibold">
            Cart{" "}
            <span className="text-sm font-normal text-slate">
              ({cart?.totalQuantity ?? 0} items)
            </span>
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            className="p-2 text-slate transition-colors hover:text-ink"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-sm text-slate">Your cart is empty.</p>
              <Link
                href="/products"
                onClick={closeDrawer}
                className="bg-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-brand-deep"
              >
                Explore the Catalog
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  <Link
                    href={`/products/${item.productHandle}`}
                    onClick={closeDrawer}
                    className="relative h-20 w-20 shrink-0 overflow-hidden border border-line bg-mist"
                  >
                    {item.image ? (
                      <Image
                        src={item.image.url}
                        alt={item.image.altText}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : null}
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/products/${item.productHandle}`}
                          onClick={closeDrawer}
                          className="text-sm font-semibold text-ink hover:text-brand"
                        >
                          {item.productTitle}
                        </Link>
                        <p className="mt-0.5 text-xs text-slate">
                          {item.variantTitle}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-ink">
                        {formatMoney(item.lineTotal)}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center border border-line">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.productTitle}`}
                          disabled={isLoading}
                          onClick={() =>
                            updateItem(item.id, item.quantity - 1)
                          }
                          className="px-3 py-1 text-sm text-slate hover:text-ink disabled:opacity-40"
                        >
                          −
                        </button>
                        <span
                          aria-label={`Quantity ${item.quantity}`}
                          className="min-w-8 text-center text-sm"
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.productTitle}`}
                          disabled={isLoading}
                          onClick={() =>
                            updateItem(item.id, item.quantity + 1)
                          }
                          className="px-3 py-1 text-sm text-slate hover:text-ink disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => removeItem(item.id)}
                        className="text-xs uppercase tracking-[0.14em] text-slate underline-offset-2 hover:text-ink hover:underline disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line px-6 py-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate">Subtotal</span>
              <span className="font-semibold text-ink">
                {formatMoney(cart?.subtotal)}
              </span>
            </div>
            <p className="mt-1 text-xs text-silver">
              Shipping and taxes are calculated at checkout. Pricing is
              confirmed by the commerce backend.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="border border-ink/20 px-4 py-3 text-center text-xs font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="bg-ink px-4 py-3 text-center text-xs font-medium uppercase tracking-[0.14em] text-paper transition-colors hover:bg-brand-deep"
              >
                Checkout
              </Link>
            </div>
            <ResearchUseNotice variant="compact" className="mt-4" />
          </div>
        )}
      </div>
    </div>
  );
}
