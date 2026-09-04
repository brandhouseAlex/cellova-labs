import type { Metadata } from "next";
import { commerce } from "@/lib/commerce";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CoaLibrary } from "@/components/coa/coa-library";

/** Cellova COA Library — provider-backed product documentation index. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "COA Library",
  description: "Browse product-specific Certificate of Analysis availability and batch documentation for Cellova Labs research materials.",
  path: "/coa-library",
});

export default async function CoaLibraryPage() {
  const { items: products } = await commerce.getProducts({ perPage: 500, sort: "alphabetical" });

  return (
    <div className="min-h-screen bg-[#F7F7F4]">
      <section className="border-b border-line bg-paper py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ name: "COA Library", path: "/coa-library" }]} />
          <p className="section-eyebrow mt-9">Transparency at Every Step</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Certificate of Analysis Library</h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate">Review available batch-specific Certificates of Analysis (COAs) for products in the Cellova Labs research catalog. Each COA corresponds to the applicable product batch and is displayed when assigned.</p>
        </div>
      </section>
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><CoaLibrary products={products} /></div>
      </section>
    </div>
  );
}
