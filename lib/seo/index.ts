import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/commerce/config";
import type {
  CommerceCollection,
  CommerceProduct,
} from "@/lib/commerce/types";

/** Build consistent page metadata with canonical URLs and social tags. */
export function buildMetadata(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteUrl}${input.path}`;
  const image = input.image ?? "/brand/cellova-wordmark.webp";

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: `${input.title} | ${siteName}`,
      description: input.description,
      url,
      siteName,
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${input.title} | ${siteName}`,
      description: input.description,
      images: [image],
    },
  };
}

/** Organization structured data for the whole site. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/brand/cellova-wordmark.webp`,
    description:
      "Cellova Labs supplies research-grade peptides and laboratory materials intended strictly for laboratory and analytical research use.",
  };
}

/** WebSite structured data. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
  };
}

/** BreadcrumbList structured data. */
export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

/**
 * Product structured data built only from real, available product fields.
 * No medical or misleading claims are included.
 */
export function productJsonLd(product: CommerceProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    sku: product.specs?.sku ?? product.variants[0]?.sku ?? undefined,
    image: product.featuredImage
      ? [`${siteUrl}${product.featuredImage.url}`]
      : undefined,
    brand: {
      "@type": "Brand",
      name: siteName,
    },
    url: `${siteUrl}/products/${product.handle}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
      offerCount: product.variants.length,
      availability: product.variants.some((v) => v.availableForSale)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}

/** Collection structured data. */
export function collectionJsonLd(collection: CommerceCollection) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.title,
    description: collection.description,
    url: `${siteUrl}/collections/${collection.handle}`,
  };
}
