"use client";

import { useMemo, useState } from "react";
import { ProductGallery } from "@/components/product/product-gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import type { CommerceImage, CommerceProduct } from "@/lib/commerce/types";

/** Keeps selected provider variant media and provider purchase controls in sync on every PDP. */
export function ProductDetailPurchase({
  product,
  hasCoa,
  category,
}: {
  product: CommerceProduct;
  hasCoa: boolean;
  category?: string;
}) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id ?? "");
  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId) ?? product.variants[0];

  const galleryImages = useMemo(() => {
    const productImages = product.images.length
      ? product.images
      : product.featuredImage
        ? [product.featuredImage]
        : [];
    const variantImage = selectedVariant?.image;
    const ordered: CommerceImage[] = variantImage
      ? [variantImage, ...productImages.filter((image) => image.url !== variantImage.url)]
      : productImages;
    return ordered.filter((image, index, all) => all.findIndex((candidate) => candidate.url === image.url) === index);
  }, [product.featuredImage, product.images, selectedVariant?.image]);

  return (
    <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 xl:gap-16">
      <div data-testid="pdp-variant-gallery" data-selected-variant={selectedVariant?.id ?? ""}>
        <ProductGallery key={selectedVariant?.id ?? "product"} title={product.title} images={galleryImages} hasCoa={hasCoa} />
      </div>
      <div className="lg:pt-1 xl:pt-2">
        <div className="flex flex-wrap items-center gap-2">
          {category ? <span className="inline-flex rounded-full border border-brand/10 bg-brand-tint px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-deep">{category}</span> : null}
          <span className="inline-flex rounded-full border border-line bg-fog px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">Research Use Only</span>
        </div>
        <h1 className="mt-4 max-w-xl font-display text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-[2.65rem]">{product.title}</h1>
        <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate">{product.description}</p>
        <div className="mt-8"><PurchasePanel product={product} selectedVariantId={selectedVariantId} onVariantChange={setSelectedVariantId} /></div>
      </div>
    </div>
  );
}
