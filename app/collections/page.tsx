import Link from "next/link";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Collections",
  description:
    "Explore Cellova Labs collections: research peptides, peptide blends, research compounds, lab essentials, and more. Research use only.",
  path: "/collections",
});

export default async function CollectionsPage() {
  const collections = await commerce.getCollections();

  return (
    /* Collections style: controlled research catalog records with documented collection codes. */
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <Breadcrumbs
        items={[{ name: "Collections", path: "/collections" }]}
      />

      <header className="mt-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">
          Catalog
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
          Collections
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate">
          Research materials organized for efficient discovery — from
          single-analyte peptides to laboratory essentials.
        </p>
      </header>

      {collections.length ? <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.handle}`}
            className="group relative block overflow-hidden rounded-[8px] border border-[#2D3452] bg-ink transition-colors hover:border-brand"
          >
            <div className="relative aspect-[16/9]">
              {collection.image ? (
                <Image
                  src={collection.image.url}
                  alt={collection.image.altText}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : null}
            </div>
            <div className="absolute inset-x-0 bottom-0 border-t border-white/15 bg-gradient-to-t from-ink via-ink/92 to-transparent p-5 pt-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F8C36A]">Collection record · {collection.handle.replace(/[-_]+/g, " ")}</p>
              <h2 className="font-display text-lg font-semibold text-paper">
                {collection.title}
              </h2>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-silver">
                {collection.description}
              </p>
              <span className="mt-4 inline-flex border-b border-[#F8C36A]/60 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-paper">Review collection →</span>
            </div>
          </Link>
        ))}
      </div> : <section className="mt-12 rounded-[12px] border border-line bg-mist p-8 sm:p-12"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Collection catalog</p><h2 className="mt-3 font-display text-2xl font-semibold text-ink">Collections are being prepared</h2><p className="mt-3 max-w-xl text-sm leading-6 text-slate">No active provider collections are available yet. Once collections are assigned in the connected commerce provider, they will appear here automatically.</p></section>}
    </div>
  );
}
