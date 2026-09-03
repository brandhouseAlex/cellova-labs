import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { commerce } from "@/lib/commerce";
import type { CommerceSortKey } from "@/lib/commerce/types";
import { buildMetadata, collectionJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ProductCard } from "@/components/product/product-card";
import { CatalogToolbar } from "@/components/product/catalog-toolbar";

interface Props {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const VALID_SORTS: CommerceSortKey[] = [
  "featured",
  "newest",
  "price-asc",
  "price-desc",
  "alphabetical",
  "alphabetical-desc",
];

const CATALOG_PAGE_SIZE = 1000;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const collection = await commerce.getCollectionByHandle(handle);
  if (!collection) {
    return buildMetadata({
      title: "Collection Not Found",
      description: "The requested collection could not be found.",
      path: `/collections/${handle}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: collection.seo?.title ?? collection.title,
    description: collection.seo?.description ?? collection.description,
    path: `/collections/${collection.handle}`,
    image: collection.image?.url,
  });
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const queryParams = await searchParams;

  const collection = await commerce.getCollectionByHandle(handle);
  if (!collection) notFound();

  const rawSort =
    typeof queryParams.sort === "string" ? queryParams.sort : "featured";
  const sort = (VALID_SORTS.includes(rawSort as CommerceSortKey)
    ? rawSort
    : "featured") as CommerceSortKey;
  const query = typeof queryParams.q === "string" ? queryParams.q : undefined;
  const productType =
    typeof queryParams.type === "string" ? queryParams.type : undefined;

  const [result, productTypes] = await Promise.all([
    commerce.getProducts({
      collection: handle,
      query,
      productType,
      sort,
      perPage: CATALOG_PAGE_SIZE,
    }),
    commerce.getProductTypes(),
  ]);

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionJsonLd(collection)),
        }}
      />

      <Breadcrumbs
        items={[
          { name: "Collections", path: "/collections" },
          { name: collection.title, path: `/collections/${collection.handle}` },
        ]}
      />

      <header className="mt-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">Catalog</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">{collectionHeading(collection.handle, collection.title)}</h1>
        <p className="mt-4 text-base leading-relaxed text-slate">{collection.description || `Browse Cellova Labs ${collection.title.toLowerCase()} for laboratory research.`}</p>
      </header>

      <div className="mt-10">
        <Suspense fallback={null}>
          <CatalogToolbar
            productTypes={productTypes}
            total={result.total}
            basePath={`/collections/${collection.handle}`}
            collectionLabel={collectionHeading(collection.handle, collection.title)}
          />
        </Suspense>
      </div>

      {result.items.length === 0 ? (
        <div className="mt-16 border border-line bg-mist p-12 text-center">
          <p className="font-display text-xl font-semibold text-ink">
            No products match your filters
          </p>
          <p className="mt-2 text-sm text-slate">
            Try adjusting your search or clearing the active filters.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4 xl:gap-6">
          {result.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function collectionHeading(handle: string, title: string) {
  const key = `${handle} ${title}`.toLowerCase();
  if (key.includes("vial")) return "Research Vials";
  if (key.includes("capsule")) return "Research Capsules";
  if (key.includes("serum")) return "Research Serums";
  return /^research\s+/i.test(title) ? title : `Research ${title}`;
}
