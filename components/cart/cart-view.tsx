"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/auth/cart-store";
import { formatMoney } from "@/lib/utils";
import { ResearchUseNotice } from "@/components/research/research-use-notice";

/** Full cart page view. Totals come from the provider, not the browser. */
export function CartView() {
  const { cart, updateItem, removeItem, isLoading } = useCart();
  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="border border-line bg-mist p-12 text-center">
        <p className="font-display text-2xl font-semibold text-ink">
          Your cart is empty
        </p>
        <p className="mt-3 text-sm text-slate">
          Browse the research catalog to find materials for your laboratory.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block bg-ink px-8 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-brand-deep"
        >
          Explore Research Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      {/* Line items */}
      <ul className="divide-y divide-line border border-line bg-paper">
        {items.map((item) => (
          <li key={item.id} className="flex gap-5 p-5">
            <Link
              href={`/products/${item.productHandle}`}
              className="relative h-24 w-24 shrink-0 overflow-hidden border border-line bg-mist"
            >
              {item.image ? (
                <Image
                  src={item.image.url}
                  alt={item.image.altText}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : null}
            </Link>
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link
                    href={`/products/${item.productHandle}`}
                    className="font-display text-base font-semibold text-ink hover:text-brand"
                  >
                    {item.productTitle}
                  </Link>
                  <p className="mt-1 text-sm text-slate">{item.variantTitle}</p>
                  <p className="mt-1 text-xs text-silver">
                    {formatMoney(item.price)} each
                  </p>
                </div>
                <p className="font-semibold text-ink">
                  {formatMoney(item.lineTotal)}
                </p>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center border border-line">
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${item.productTitle}`}
                    disabled={isLoading}
                    onClick={() => updateItem(item.id, item.quantity - 1)}
                    className="px-3.5 py-1.5 text-slate hover:text-ink disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="min-w-10 text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label={`Increase quantity of ${item.productTitle}`}
                    disabled={isLoading}
                    onClick={() => updateItem(item.id, item.quantity + 1)}
                    className="px-3.5 py-1.5 text-slate hover:text-ink disabled:opacity-40"
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

      {/* Summary */}
      <aside className="h-fit border border-line bg-mist p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Order Summary
        </h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate">Subtotal</dt>
            <dd className="font-medium text-ink">
              {formatMoney(cart?.subtotal)}
            </dd>
          </div>
          {cart && parseFloat(cart.discountTotal.amount) > 0 ? (
            <div className="flex justify-between">
              <dt className="text-slate">Discounts</dt>
              <dd className="font-medium text-brand-deep">
                −{formatMoney(cart.discountTotal)}
              </dd>
            </div>
          ) : null}
          <div className="flex justify-between">
            <dt className="text-slate">Estimated shipping</dt>
            <dd className="font-medium text-ink">
              {cart?.estimatedShipping
                ? formatMoney(cart.estimatedShipping)
                : "Calculated at checkout"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate">Estimated taxes</dt>
            <dd className="font-medium text-ink">
              {cart?.estimatedTaxes
                ? formatMoney(cart.estimatedTaxes)
                : "Calculated at checkout"}
            </dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base">
            <dt className="font-semibold text-ink">Total</dt>
            <dd className="font-semibold text-ink">
              {formatMoney(cart?.total)}
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-silver">
          Final pricing, discounts, shipping, and taxes are confirmed by the
          commerce backend at checkout.
        </p>
        <Link
          href="/checkout"
          className="mt-6 block bg-ink px-6 py-4 text-center text-sm font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-brand-deep"
        >
          Proceed to Checkout
        </Link>
        <ResearchUseNotice variant="compact" className="mt-5" />
      </aside>
    </div>
  );
}
