import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { commerce } from "@/lib/commerce";
import { buildMetadata, productJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ProductDetailPurchase } from "@/components/product/product-detail-purchase";
import { ProductInformationTabs } from "@/components/product/product-information-tabs";
import { RelatedProducts } from "@/components/product/related-products";
import { ResearchStandardsBand } from "@/components/product/research-standards-band";

/**
 * PDP style: a balanced, clinical ecommerce dossier. Product media, pricing,
 * variants, availability, COAs, and related records stay normalized provider data.
 */

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await commerce.getProductByHandle(handle);
  if (!product) {
    return buildMetadata({
      title: "Product Not Found",
      description: "The requested product could not be found.",
      path: `/products/${handle}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: product.seo?.title ?? `${product.title} — Research Use Only`,
    description: product.seo?.description ?? product.description.slice(0, 155),
    path: `/products/${product.handle}`,
    image: product.featuredImage?.url,
  });
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await commerce.getProductByHandle(handle);
  if (!product) notFound();

  const featured = (await commerce.getProducts({ perPage: 8 as const, sort: "alphabetical" })).items
    .filter((item) => item.id !== product.id)
    .slice(0, 5);
  const hasCoa = [...(product.coas ?? []), product.coa].some((coa) => Boolean(coa && [coa.productName, coa.lotNumber, coa.testedDate, coa.laboratory, coa.identityMs, coa.purityHplc, coa.netContent, coa.endotoxin, coa.heavyMetals].every((value) => value?.trim())));
  return (
    <div className="bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(product)),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Breadcrumbs items={[{ name: "Products", path: "/products" }, { name: product.title, path: `/products/${product.handle}` }]} />
        <ProductDetailPurchase product={product} hasCoa={hasCoa} category={productCategory(product)} />
        <ProductInformationTabs product={product} />
        <ResearchStandardsBand />
        <RelatedProducts products={featured} title="Featured Products" eyebrow="Catalog selection" headingId="featured-products-heading" variant="featured" />
      </div>
    </div>
  );
}

function productCategory(product: { collections: string[]; productType: string }) {
  const raw = product.collections[0] || product.productType;
  return raw ? raw.replace(/[-_]+/g, " ") : "";
}
