"use client";

import { useMemo, useState } from "react";
import type { CommerceProduct } from "@/lib/commerce/types";
import { useCart } from "@/lib/auth/cart-store";
import { useAuth } from "@/lib/auth/auth-store";
import { formatMoney, cn } from "@/lib/utils";
import Link from "next/link";

/**
 * PDP style: compact laboratory-purchase controls with dark selected variants,
 * a Cellova-amber CTA, and softly rounded scientific-instrument geometry.
 * Pricing and cart identifiers remain active-provider values only.
 */
export function PurchasePanel({ product }: { product: CommerceProduct }) {
  const { addItem, isLoading } = useCart();
  const { isAuthenticated, isReady } = useAuth();

  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id ?? ""
  );
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const variant = useMemo(
    () =>
      product.variants.find((v) => v.id === selectedVariantId) ??
      product.variants[0],
    [product.variants, selectedVariantId]
  );

  async function handleAdd() {
    if (!variant) return;
    setError(null);
    try {
      await addItem(variant.id, quantity);
    } catch {
      setError("Unable to add this item to your cart. Please try again.");
    }
  }

  if (isReady && !isAuthenticated) {
    return (
      <div className="rounded-[10px] border border-line bg-mist p-6 shadow-[0_14px_28px_-26px_rgba(32,32,32,0.52)]">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
          Account Required to Order
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate">
          Sign in to your research account — or create one — to purchase this
          material. Pricing is public; ordering is restricted to verified
          research accounts.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/account"
            className="rounded-[8px] bg-ink px-6 py-3 text-center text-xs font-medium uppercase tracking-[0.14em] text-paper transition-colors hover:bg-brand-deep"
          >
            Login
          </Link>
          <Link
            href="/account?mode=register"
            className="rounded-[8px] border border-ink/20 px-6 py-3 text-center text-xs font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Price */}
      {variant ? (
        <p data-testid="selected-variant-price" className="font-display text-[2rem] font-semibold leading-none tracking-tight text-ink sm:text-[2.2rem]">
          {formatMoney(variant.price)}
          <span className="ml-2 align-middle text-sm font-normal tracking-normal text-slate">
            / {variant.title}
          </span>
        </p>
      ) : null}

      {/* Variant selector */}
      {product.options.map((option) => (
        <fieldset key={option.id}>
          <legend className="mb-3 text-sm font-semibold text-ink">
            {option.name}
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const value = v.selectedOptions[option.name] ?? v.title;
              const selected = v.id === selectedVariantId;
              return (
                <button
                  key={v.id}
                  type="button"
                  data-variant-id={v.id}
                  onClick={() => setSelectedVariantId(v.id)}
                  aria-pressed={selected}
                  className={cn(
                    "rounded-[8px] border px-5 py-2.5 text-sm font-medium shadow-[0_7px_16px_-16px_rgba(32,32,32,0.55)] transition-all duration-200 active:scale-[0.985]",
                    selected
                      ? "border-ink bg-ink text-paper shadow-[0_10px_20px_-15px_rgba(32,32,32,0.8)]"
                      : "border-line bg-paper text-ink hover:border-brand hover:bg-brand-tint/45"
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div>
        <label htmlFor="quantity" className="mb-3 block text-sm font-semibold text-ink">Quantity</label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <div className="inline-flex items-center self-start rounded-[8px] border border-line bg-paper shadow-[0_7px_16px_-16px_rgba(32,32,32,0.55)] sm:self-auto">
            <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-4 py-3 text-slate transition-colors hover:bg-brand-tint hover:text-ink">−</button>
            <input id="quantity" type="number" min={1} max={99} value={quantity} onChange={(e) => setQuantity(Math.min(99, Math.max(1, parseInt(e.target.value, 10) || 1)))} className="w-14 border-x border-line bg-transparent py-3 text-center text-sm text-ink focus:outline-none" />
            <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((q) => Math.min(99, q + 1))} className="px-4 py-3 text-slate transition-colors hover:bg-brand-tint hover:text-ink">+</button>
          </div>
          <button type="button" onClick={handleAdd} disabled={isLoading || !variant?.availableForSale} className="flex flex-1 items-center justify-center gap-3 rounded-[8px] bg-gradient-to-r from-brand-deep to-brand px-8 py-3.5 text-sm font-semibold text-paper shadow-[0_14px_26px_-16px_rgba(45,52,82,0.85)] transition-all duration-200 hover:from-[#2D3452] hover:to-brand-deep hover:shadow-[0_18px_30px_-16px_rgba(45,52,82,0.95)] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50"><CartIcon className="h-5 w-5" />{isLoading ? "Adding…" : variant?.availableForSale ? "Add to Cart" : "Unavailable"}</button>
        </div>
      </div>

      {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

function CartIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 1.95-1.55L20 8H7" /><circle cx="10" cy="20" r="1" /><circle cx="17" cy="20" r="1" /></svg>;
}
