import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { commerce } from "@/lib/commerce";
import { buildMetadata, productJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInformationTabs } from "@/components/product/product-information-tabs";
import { RelatedProducts } from "@/components/product/related-products";

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
  const galleryImages = product.images.length ? product.images : product.featuredImage ? [product.featuredImage] : [];

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
        <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 xl:gap-16">
          <ProductGallery title={product.title} images={galleryImages} hasCoa={hasCoa} />
          <div className="lg:pt-1 xl:pt-2">
            <div className="flex flex-wrap items-center gap-2">
              {productCategory(product) ? <span className="inline-flex rounded-full border border-brand/10 bg-brand-tint px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-deep">{productCategory(product)}</span> : null}
              <span className="inline-flex rounded-full border border-line bg-fog px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">Research Use Only</span>
            </div>
            <h1 className="mt-4 max-w-xl font-display text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-[2.65rem]">{product.title}</h1>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate">{product.description}</p>
            <div className="mt-7 grid gap-2 rounded-[12px] border border-[#D8DCE3] bg-gradient-to-br from-paper via-[#F7F7F4] to-[#FFF1DB] p-3 text-sm shadow-[0_14px_26px_-28px_rgba(32,32,32,0.42)] sm:grid-cols-3 sm:gap-0">
              <QualityBadge icon="shield" label="Quality Standards" detail="Maintained to the highest level" />
              <QualityBadge icon="check" label="Third-Party Tested" detail="Independently verified for purity & identity" />
              <QualityBadge icon="flag" label="USA Made" detail="Proudly manufactured in the USA" />
            </div>
            <div className="mt-8"><PurchasePanel product={product} /></div>
            <div className="mt-8 grid grid-cols-3 divide-x divide-line border-t border-line pt-5 text-xs text-slate"><Reassurance icon="truck" label="Fast nationwide shipping" /><Reassurance icon="flask" label="cGMP compliant facility" /><Reassurance icon="box" label="Secure & discreet packaging" /></div>
          </div>
        </div>
        <ProductInformationTabs product={product} />
        <ServiceCards />
        <RelatedProducts products={featured} title="Featured Products" eyebrow="Catalog selection" headingId="featured-products-heading" variant="featured" />
      </div>
    </div>
  );
}

function productCategory(product: { collections: string[]; productType: string }) {
  const raw = product.collections[0] || product.productType;
  return raw ? raw.replace(/[-_]+/g, " ") : "";
}

function QualityBadge({ icon, label, detail }: { icon: "shield" | "check" | "flag"; label: string; detail: string }) { return <span className="flex items-start gap-2.5 rounded-[8px] px-2.5 py-2.5 text-left sm:px-3 sm:not-first:border-l sm:not-first:border-[#D8DCE3]">{icon === "flag" ? <UsaFlagIcon className="mt-0.5 h-4 w-5 shrink-0" /> : <QualityIcon name={icon} className="mt-0.5 h-5 w-5 shrink-0 text-brand-deep" />}<span><span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-ink">{label}</span><span className="mt-1 block text-[11px] font-normal leading-4 text-slate">{detail}</span></span></span>; }
function Reassurance({ icon, label }: { icon: "truck" | "box" | "flask"; label: string }) { return <span className="flex flex-col items-center gap-2 px-2 text-center leading-4 sm:flex-row sm:items-start sm:text-left"><QualityIcon name={icon} className="h-6 w-6 shrink-0 text-brand-deep" /><span>{label}</span></span>; }
function ServiceCards() {
  const cards = [
    ["truck", "Next-Day Shipping", "Orders placed before 12pm EST (M–F) ship the next business day for faster turnaround"],
    ["box", "On Time Delivery", "Multiple shipping options for reliable, on-time delivery."],
    ["flask", "Standards Matter", "Manufactured in cGMP-compliant facilities to high laboratory standards."],
  ] as const;
  return <section className="mt-7 grid gap-3 sm:grid-cols-3" aria-label="Service commitments">{cards.map(([icon, title, body]) => <article key={title} className="relative overflow-hidden rounded-[11px] border border-line bg-paper p-5 shadow-[0_15px_28px_-25px_rgba(32,32,32,0.46)]"><div className="pointer-events-none absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-brand-tint/75 to-transparent" /><div className="relative flex gap-3"><QualityIcon name={icon} className="mt-0.5 h-7 w-7 shrink-0 text-brand-deep" /><div><h3 className="text-sm font-semibold text-ink">{title}</h3><p className="mt-2 text-xs leading-5 text-slate">{body}</p></div></div></article>)}</section>;
}
function QualityIcon({ name, className }: { name: string; className?: string }) { if (name === "support") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M5 18.25A8.1 8.1 0 1 1 19 18.25L21 21l-4.35-1.1a8.1 8.1 0 0 1-11.65-1.65Z" /><path d="M8.25 12h.01M12 12h.01M15.75 12h.01" /></svg>; const paths: Record<string, string> = { shield: "M12 3 19 6v5c0 4.4-3 8.4-7 10-4-1.6-7-5.6-7-10V6l7-3Z", check: "m5 12 4 4L19 6", flag: "M5 21V4m0 1h12l-2.4 3.5L17 12H5", flask: "M9 3h6M10 3v6L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3M8 15h8", truck: "M3 6h11v10H3zM14 9h4l3 3v4h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z", box: "m4 7 8-4 8 4v10l-8 4-8-4ZM4 7l8 4 8-4M12 11v10" }; return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d={paths[name] ?? paths.shield} /></svg>; }
function UsaFlagIcon({ className }: { className?: string }) { return <svg viewBox="0 0 24 16" className={className} aria-label="USA flag" role="img"><rect width="24" height="16" rx="1.5" fill="#fff" stroke="#8B93A7" strokeWidth="0.6" /><path d="M0 2h24M0 6h24M0 10h24M0 14h24" stroke="#B22234" strokeWidth="1.7" /><rect width="10.5" height="8.4" rx="1" fill="#2D3452" /><circle cx="2.5" cy="2" r="0.55" fill="#fff" /><circle cx="5.2" cy="2" r="0.55" fill="#fff" /><circle cx="7.9" cy="2" r="0.55" fill="#fff" /><circle cx="3.85" cy="4.2" r="0.55" fill="#fff" /><circle cx="6.55" cy="4.2" r="0.55" fill="#fff" /><circle cx="2.5" cy="6.4" r="0.55" fill="#fff" /><circle cx="5.2" cy="6.4" r="0.55" fill="#fff" /><circle cx="7.9" cy="6.4" r="0.55" fill="#fff" /></svg>; }
