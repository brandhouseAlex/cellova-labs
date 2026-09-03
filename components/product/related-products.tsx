"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { CommerceProduct } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/utils";
import { useCart } from "@/lib/auth/cart-store";
import { useAuth } from "@/lib/auth/auth-store";

/** Provider-backed PDP recommendations; all product cards use normalized data. */
export function RelatedProducts({ products, title = "You may also research", eyebrow = "Continue exploring", headingId = "related-heading", variant = "related" }: { products: CommerceProduct[]; title?: string; eyebrow?: string; headingId?: string; variant?: "related" | "featured" }) {
  if (!products.length) return null;
  return <section aria-labelledby={headingId} className="mt-16"><div className="flex items-end justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">{eyebrow}</p><h2 id={headingId} className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h2></div><Link href="/products" className="hidden text-sm font-semibold text-brand-deep hover:underline sm:inline">View all products →</Link></div><div className={`mt-7 grid auto-cols-[minmax(205px,1fr)] grid-flow-col gap-4 overflow-x-auto pb-3 lg:auto-cols-[minmax(220px,1fr)] ${variant === "featured" ? "featured-products-grid" : ""}`}>{products.map((product) => <RelatedProductCard key={product.id} product={product} variant={variant} />)}</div><Link href="/products" className="mt-5 inline-flex text-sm font-semibold text-brand-deep hover:underline sm:hidden">View all products →</Link></section>;
}

function RelatedProductCard({ product, variant: cardVariant }: { product: CommerceProduct; variant: "related" | "featured" }) {
  const { addItem, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const variant = product.variants.find((item) => item.availableForSale) ?? product.variants[0];
  const available = Boolean(variant?.availableForSale);
  const handleAdd = async () => {
    if (!variant || !available) return;
    setError(null);
    try { await addItem(variant.id, 1); } catch { setError("Unable to add item"); }
  };
  if (cardVariant === "featured") {
    return <article className="group flex min-h-[184px] flex-col justify-center rounded-[7px] border border-line bg-paper px-5 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand/45 hover:shadow-[0_18px_38px_-26px_rgba(32,32,32,0.3)]"><h3 className="font-display text-base font-semibold text-ink"><Link href={`/products/${product.handle}`} className="transition-colors hover:text-brand-deep">{product.title}</Link></h3><p className="mt-3 text-sm font-semibold text-ink">{variant ? formatMoney(variant.price) : "Price unavailable"}</p>{isAuthenticated ? <button type="button" onClick={handleAdd} disabled={isLoading || !available} className="mx-auto mt-6 rounded-[6px] border border-brand/55 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-deep transition-colors hover:bg-brand hover:text-paper disabled:cursor-not-allowed disabled:opacity-50">{isLoading ? "Adding…" : available ? "Add to Cart" : "Unavailable"}</button> : <Link href="/account" className="mx-auto mt-6 rounded-[6px] border border-brand/55 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-deep transition-colors hover:bg-brand hover:text-paper">Sign in to order</Link>}{error ? <p role="alert" className="mt-2 text-xs text-red-700">{error}</p> : null}</article>;
  }

  return <article className="group flex min-h-[330px] flex-col overflow-hidden rounded-[6px] border border-line bg-paper transition-all duration-300 hover:-translate-y-1 hover:border-brand/45 hover:shadow-[0_18px_38px_-26px_rgba(32,32,32,0.3)]"><Link href={`/products/${product.handle}`} className="relative block h-44 border-b border-[#D8DCE3] bg-gradient-to-b from-brand-tint/45 to-paper" aria-label={`View ${product.title}`}>{product.featuredImage ? <Image src={product.featuredImage.url} alt={product.featuredImage.altText} fill sizes="220px" className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04]" /> : <span className="flex h-full items-center justify-center text-xs text-silver">Image unavailable</span>}</Link><div className="flex flex-1 flex-col p-4"><p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-deep">Research record · {product.productType || "Catalog"}</p><h3 className="mt-2 font-display text-base font-semibold text-ink"><Link href={`/products/${product.handle}`} className="hover:text-brand-deep">{product.title}</Link></h3><p className="mt-1 text-xs font-medium text-brand-deep">{variant?.title ?? "Variant unavailable"}</p><p className="mt-3 border-t border-[#D8DCE3] pt-3 text-sm font-semibold text-ink">{variant ? formatMoney(variant.price) : "Price unavailable"}</p>{isAuthenticated ? <button type="button" onClick={handleAdd} disabled={isLoading || !available} className="mt-auto rounded-[6px] border border-brand/55 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-deep transition-colors hover:bg-brand hover:text-paper disabled:cursor-not-allowed disabled:opacity-50">{isLoading ? "Adding…" : available ? "Add to Cart" : "Unavailable"}</button> : <Link href="/account" className="mt-auto rounded-[6px] border border-brand/55 px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-deep transition-colors hover:bg-brand hover:text-paper">Sign in to order</Link>}{error ? <p role="alert" className="mt-2 text-xs text-red-700">{error}</p> : null}</div></article>;
}
