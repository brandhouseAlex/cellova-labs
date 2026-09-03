"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { CommerceCollection, CommerceProduct } from "@/lib/commerce/types";
import { cn, formatMoney } from "@/lib/utils";

/**
 * Cellova's collection-led product browser. Collections and products arrive
 * normalized through the shared commerce facade, never directly from Shopify.
 */
type CollectionOption = {
  id: string;
  label: string;
  href: string;
  products: CommerceProduct[];
};

export function TopCompounds({
  collections,
  products,
}: {
  collections: CommerceCollection[];
  products: CommerceProduct[];
}) {
  const options = useMemo<CollectionOption[]>(() => {
    const allProducts: CollectionOption = {
      id: "all-products",
      label: "All Products",
      href: "/products",
      products,
    };

    return [
      allProducts,
      ...collections.map((collection) => ({
        id: collection.handle,
        label: collection.title,
        href: `/collections/${collection.handle}`,
        products: products.filter((product) => product.collections.includes(collection.handle)),
      })),
    ];
  }, [collections, products]);

  const [activeId, setActiveId] = useState("all-products");
  const active = options.find((option) => option.id === activeId) ?? options[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="lg:pt-1">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">Featured Research Compounds</p>
        <h3 className="mt-4 max-w-[13rem] font-display text-3xl font-semibold leading-[1.05] tracking-tight text-ink">Top Compounds in Demand</h3>
        <p className="mt-4 max-w-[13rem] text-sm leading-relaxed text-slate">Browse the active research collections currently available in the catalog.</p>

        {options.length > 1 ? (
          <div className="mt-8 grid gap-2" role="tablist" aria-label="Filter compounds by collection">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={active?.id === option.id}
                onClick={() => setActiveId(option.id)}
                className={cn(
                  "w-full rounded-[6px] border px-4 py-2.5 text-left text-xs font-medium transition-all duration-200 active:scale-[0.98]",
                  active?.id === option.id
                    ? "border-brand bg-brand-tint text-brand-deep shadow-[0_5px_16px_-10px_rgba(45,52,82,0.5)]"
                    : "border-line bg-paper text-slate hover:border-brand/50 hover:bg-brand-tint/40 hover:text-ink"
                )}
              >
                <span className="block truncate">{option.label}</span>
                <span className="mt-0.5 block text-[10px] font-medium text-current opacity-65">{option.products.length} {option.products.length === 1 ? "product" : "products"}</span>
              </button>
            ))}
          </div>
        ) : null}
      </aside>

      <div>
        {active?.products.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {active.products.map((product) => <CompactProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="flex min-h-64 items-center justify-center rounded-[10px] border border-dashed border-brand/35 bg-brand-tint/30 px-6 text-center">
            <div>
              <p className="font-display text-xl font-semibold text-ink">No available products in this collection</p>
              <p className="mt-2 text-sm text-slate">Products appear here when published and available through the active commerce provider.</p>
            </div>
          </div>
        )}
        <div className="mt-8 flex justify-center sm:justify-end">
          <Link href={active?.href ?? "/products"} className="inline-flex items-center justify-center rounded-[6px] bg-brand px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-paper transition-all duration-200 hover:bg-brand-deep hover:shadow-[0_12px_24px_-14px_rgba(45,52,82,0.8)] active:scale-[0.98]">
            Shop {active?.id === "all-products" ? "All Products" : active?.label ?? "Collection"} <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function CompactProductCard({ product }: { product: CommerceProduct }) {
  const { priceRange } = product;
  const isSinglePrice = priceRange.minVariantPrice.amount === priceRange.maxVariantPrice.amount;
  const firstAvailableVariant = product.variants.find((variant) => variant.availableForSale);
  const strength = firstAvailableVariant?.title ?? product.variants[0]?.title ?? "Unavailable";

  return (
    <article className="group flex min-h-[320px] flex-col overflow-hidden rounded-[8px] border border-line bg-paper transition-all duration-300 hover:-translate-y-1 hover:border-brand/45 hover:shadow-[0_18px_36px_-22px_rgba(40,40,40,0.4)]">
      <Link href={`/products/${product.handle}`} className="relative block h-40 overflow-hidden bg-gradient-to-b from-brand-tint/65 to-paper" aria-label={`View ${product.title}`}>
        {product.featuredImage ? <Image src={product.featuredImage.url} alt={product.featuredImage.altText} fill sizes="(min-width: 1280px) 20vw, (min-width: 640px) 40vw, 90vw" className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.05]" /> : <span className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.18em] text-silver">Image pending</span>}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h4 className="font-display text-base font-semibold tracking-tight text-ink"><Link href={`/products/${product.handle}`} className="transition-colors hover:text-brand-deep">{product.title}</Link></h4>
        <p className={cn("mt-1 text-xs font-medium", firstAvailableVariant ? "text-brand-deep" : "text-slate")}>{strength}</p>
        <p className="mt-3 text-sm font-semibold text-ink">{isSinglePrice ? formatMoney(priceRange.minVariantPrice) : `${formatMoney(priceRange.minVariantPrice)} – ${formatMoney(priceRange.maxVariantPrice)}`}</p>
        <Link href={`/products/${product.handle}`} className="mt-auto rounded-[6px] border border-brand/55 px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-deep transition-all duration-200 hover:bg-brand hover:text-paper active:scale-[0.98]">
          {firstAvailableVariant ? "View Product" : "View Availability"}
        </Link>
      </div>
    </article>
  );
}
