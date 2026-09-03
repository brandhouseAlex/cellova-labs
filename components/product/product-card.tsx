"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { CommerceProduct } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/utils";
import { ResearchUseBadge } from "@/components/ui/primitives";
import { useCart } from "@/lib/auth/cart-store";
import { useAuth } from "@/lib/auth/auth-store";
import { getPresentationImage } from "@/lib/commerce/presentation-image";

/**
 * Catalog style: an uncluttered clinical product card. All media and
 * purchasable information remain live normalized provider data.
 */
export function ProductCard({ product }: { product: CommerceProduct }) {
  const { addItem, isLoading } = useCart();
  const { isAuthenticated, isReady } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { priceRange } = product;
  const presentationImage = getPresentationImage(product);
  const samePrice =
    priceRange.minVariantPrice.amount === priceRange.maxVariantPrice.amount;

  const singleVariant = product.variants.length === 1 ? product.variants[0] : null;
  const canAddDirectly = Boolean(singleVariant?.availableForSale && isAuthenticated);
  const variantLabel = singleVariant?.title && !/^default title$/i.test(singleVariant.title) ? ` – ${singleVariant.title}` : "";

  async function addToCart() {
    if (!singleVariant || !canAddDirectly) return;
    setError(null);
    try {
      await addItem(singleVariant.id, 1);
    } catch {
      setError("Unable to add this item. Please try again.");
    }
  }

  return (
    <article data-product-type={product.productType} className="group relative flex min-h-full flex-col rounded-[12px] border border-line bg-paper p-4 shadow-[0_12px_28px_-30px_rgba(32,32,32,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_18px_36px_-28px_rgba(32,32,32,0.42)]">
      <Link
        href={`/products/${product.handle}`}
        className="relative block aspect-[.88/1] overflow-hidden rounded-[8px] bg-paper"
        aria-label={`View ${product.title}`}
      >
        {presentationImage ? (
          <Image
            src={presentationImage.url}
            alt={presentationImage.altText}
            fill
            sizes="(min-width: 1280px) 23vw, (min-width: 768px) 30vw, 48vw"
            className="object-contain object-center p-2"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-sm text-silver">
            Image pending
          </span>
        )}
        <span className="absolute left-3 top-3">
          <ResearchUseBadge />
        </span>
      </Link>

      <div className="flex flex-1 flex-col pt-4 text-center">
        <h3 className="min-h-[2.75rem] font-display text-[15px] font-semibold leading-5 tracking-tight text-ink sm:text-base">
          <Link
            href={`/products/${product.handle}`}
            className="transition-colors hover:text-brand"
          >
            {product.title}{variantLabel}
          </Link>
        </h3>
        <div className="mt-auto pt-2">
          <p className="text-base font-bold text-ink">
            {samePrice
              ? formatMoney(priceRange.minVariantPrice)
              : `${formatMoney(priceRange.minVariantPrice)} – ${formatMoney(
                  priceRange.maxVariantPrice
                )}`}
          </p>
          {canAddDirectly ? <button type="button" onClick={addToCart} disabled={isLoading} className="mt-4 w-full rounded-[8px] bg-brand px-4 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-brand-deep disabled:opacity-50">{isLoading ? "Adding…" : "Add to Cart"}</button> : <Link href={`/products/${product.handle}`} className="mt-4 block w-full rounded-[8px] border border-brand/60 px-4 py-2.5 text-sm font-semibold text-brand-deep transition-colors hover:bg-brand-tint" aria-label={`View product ${product.title}`}>{isReady && !isAuthenticated ? "Sign In to Order" : "View Product"}</Link>}
          {error ? <p role="alert" className="mt-2 text-xs text-red-700">{error}</p> : null}
        </div>
      </div>
    </article>
  );
}
