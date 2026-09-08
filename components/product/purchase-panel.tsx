"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import type { CommerceProduct } from "@/lib/commerce/types";
import { useCart } from "@/lib/auth/cart-store";
import { useAuth } from "@/lib/auth/auth-store";
import { formatMoney, cn } from "@/lib/utils";
import { shouldSuppressDefaultVariantDetails } from "@/lib/commerce/variants";

/** Provider-backed purchase controls with a reference-aligned fulfillment panel. */
export function PurchasePanel({ product }: { product: CommerceProduct }) {
  const { addItem, isLoading } = useCart();
  const { isAuthenticated, isReady } = useAuth();
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const hideDefaultVariantDetails = shouldSuppressDefaultVariantDetails(product);
  const variant = useMemo(() => product.variants.find((item) => item.id === selectedVariantId) ?? product.variants[0], [product.variants, selectedVariantId]);

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
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">Account Required to Order</p>
        <p className="mt-2 text-sm leading-relaxed text-slate">Sign in to your research account — or create one — to purchase this material. Pricing is public; ordering is restricted to verified research accounts.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href="/account" className="rounded-[8px] bg-ink px-6 py-3 text-center text-xs font-medium uppercase tracking-[0.14em] text-paper transition-colors hover:bg-brand-deep">Login</Link>
          <Link href="/account?mode=register" className="rounded-[8px] border border-ink/20 px-6 py-3 text-center text-xs font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink">Create Account</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {variant ? (
        <p data-testid="selected-variant-price" className="font-display text-[2rem] font-semibold leading-none tracking-tight text-ink sm:text-[2.2rem]">
          {formatMoney(variant.price)}
          {!hideDefaultVariantDetails ? <span className="ml-2 align-middle text-sm font-normal tracking-normal text-slate">/ {variant.title}</span> : null}
        </p>
      ) : null}

      {!hideDefaultVariantDetails ? product.options.map((option) => (
        <fieldset key={option.id}>
          <legend className="mb-3 text-sm font-semibold text-ink">{option.name}</legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((item) => {
              const value = item.selectedOptions[option.name] ?? item.title;
              const selected = item.id === selectedVariantId;
              return <button key={item.id} type="button" data-variant-id={item.id} onClick={() => setSelectedVariantId(item.id)} aria-pressed={selected} className={cn("rounded-[8px] border px-5 py-2.5 text-sm font-medium shadow-[0_7px_16px_-16px_rgba(32,32,32,0.55)] transition-all duration-200 active:scale-[0.985]", selected ? "border-ink bg-ink text-paper shadow-[0_10px_20px_-15px_rgba(32,32,32,0.8)]" : "border-line bg-paper text-ink hover:border-brand hover:bg-brand-tint/45")}>{value}</button>;
            })}
          </div>
        </fieldset>
      )) : null}

      <section data-testid="pdp-purchase-panel" className="overflow-hidden rounded-[12px] border border-[rgba(139,147,167,0.16)] bg-[linear-gradient(105deg,rgba(139,147,167,0.04)_0%,rgba(139,147,167,0.08)_45%,rgba(139,147,167,0.15)_100%)] p-3.5 shadow-[0_16px_32px_-27px_rgba(18,20,28,.25)] sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[minmax(12.5rem,.78fr)_minmax(0,1.22fr)]">
          <div role="group" aria-label="Quantity" className="flex items-center rounded-[8px] border border-[#C9D4E9] bg-paper shadow-[0_8px_18px_-18px_rgba(18,20,28,.5)]">
            <label htmlFor="quantity" className="sr-only">Quantity</label>
            <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="flex h-14 w-14 items-center justify-center text-2xl font-medium leading-none text-[#2D3452] transition-colors hover:bg-[#F2A63C]/15">−</button>
            <input id="quantity" type="number" min={1} max={99} value={quantity} onChange={(event) => setQuantity(Math.min(99, Math.max(1, parseInt(event.target.value, 10) || 1)))} className="h-14 min-w-0 flex-1 border-x border-[#C9D4E9] bg-transparent text-center text-lg font-semibold text-[#2D3452] focus:outline-none" />
            <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((current) => Math.min(99, current + 1))} className="flex h-14 w-14 items-center justify-center text-3xl font-normal leading-none text-[#2D3452] transition-colors hover:bg-[#F2A63C]/15">+</button>
          </div>
          <button type="button" onClick={handleAdd} disabled={isLoading || !variant?.availableForSale} className="flex min-h-14 items-center justify-center gap-3 rounded-[8px] bg-gradient-to-r from-[#F2A63C] to-[#E7A12F] px-8 text-base font-semibold uppercase tracking-[.045em] text-[#2D3452] shadow-[0_14px_26px_-16px_rgba(45,52,82,.65)] transition-all duration-200 hover:from-[#E7A12F] hover:to-[#F2A63C] hover:shadow-[0_18px_30px_-16px_rgba(45,52,82,.78)] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50"><CartIcon className="h-5 w-5" />{isLoading ? "Adding…" : variant?.availableForSale ? "Add to Cart" : "Unavailable"}</button>
        </div>
        <FulfillmentDetails />
      </section>

      {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

type FulfillmentIconName = "truck" | "clock" | "shield" | "shield-check" | "support";
type FulfillmentDetail = readonly [FulfillmentIconName, string, ReactNode];

const FULFILLMENT_DETAILS: readonly FulfillmentDetail[] = [
  ["truck", "Free standard shipping", "on orders over $150"],
  ["clock", "Next day shipping", "Mon–Thu before 12 p.m. EST"],
  ["shield", "UPS", <>2–5 business days<br className="hidden sm:block" />Overnight options available at checkout.</>],
  ["shield-check", "Secure checkout", "Credit card processing available."],
  ["support", "Expert support", "Have questions? We’re here to help."],
];

export function FulfillmentDetails() {
  return (
    <div className="mt-4 divide-y divide-[#BECBE2] border-t border-[#9FB0CD]">
      {FULFILLMENT_DETAILS.map(([icon, label, detail]) => (
        <div key={label} data-testid="fulfillment-row" className="grid grid-cols-[2rem_minmax(8.75rem,.95fr)_minmax(0,1.25fr)] items-center gap-2.5 py-3 text-sm sm:grid-cols-[2.5rem_minmax(12rem,.95fr)_minmax(0,1.25fr)] sm:gap-3.5 sm:py-3.5">
          <FulfillmentIcon name={icon} className="h-6 w-6 text-[#2D3452]" />
          <span className="font-semibold text-[#2D3452]">{label}</span>
          <span className="text-right leading-5 text-[#657493] sm:text-left">{detail}</span>
        </div>
      ))}
    </div>
  );
}

function CartIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 1.95-1.55L20 8H7" /><circle cx="10" cy="20" r="1" /><circle cx="17" cy="20" r="1" /></svg>;
}

function FulfillmentIcon({ name, className }: { name: FulfillmentIconName; className?: string }) {
  const paths = {
    truck: <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2M4 9H2m2 6H2" /></>,
    shield: <><path d="M12 3 19 6v5c0 4.4-3 8.4-7 10-4-1.6-7-5.6-7-10V6l7-3Z" /><path d="M8.4 9.3h7.2M9.6 12h4.8M10.6 14.7h2.8" /></>,
    "shield-check": <><path d="M12 3 19 6v5c0 4.4-3 8.4-7 10-4-1.6-7-5.6-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" /></>,
    support: <><path d="M5 17.5V12a7 7 0 0 1 14 0v5.5M5 13H3.5v4.5H7V13H5ZM19 13h1.5v4.5H17V13h2ZM17 19c0 1.1-.9 2-2 2h-2" /></>,
  } as const;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{paths[name]}</svg>;
}
