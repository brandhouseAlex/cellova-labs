import { Suspense } from "react";
import { commerce } from "@/lib/commerce";
import type { CommerceSortKey } from "@/lib/commerce/types";
import { buildMetadata } from "@/lib/seo";
import { ProductCard } from "@/components/product/product-card";
import { CatalogToolbar } from "@/components/product/catalog-toolbar";

export const metadata = buildMetadata({
  title: "All Research Products",
  description:
    "Browse the complete Cellova Labs catalog of research peptides, blends, compounds, and laboratory essentials. Research use only.",
  path: "/products",
});

const VALID_SORTS: CommerceSortKey[] = [
  "featured",
  "newest",
  "price-asc",
  "price-desc",
  "alphabetical",
  "alphabetical-desc",
];

const CATALOG_PAGE_SIZE = 1000;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const rawSort = typeof params.sort === "string" ? params.sort : "featured";
  const sort = (VALID_SORTS.includes(rawSort as CommerceSortKey)
    ? rawSort
    : "featured") as CommerceSortKey;
  const query = typeof params.q === "string" ? params.q : undefined;
  const productType =
    typeof params.type === "string" ? params.type : undefined;

  const [result, productTypes] = await Promise.all([
    commerce.getProducts({
      query,
      productType,
      sort,
      perPage: CATALOG_PAGE_SIZE,
    }),
    commerce.getProductTypes(),
  ]);

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <header className="max-w-2xl">
        <p className="section-eyebrow">
          Catalog
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
          All Research Products
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate">
          The complete Cellova Labs catalog of research peptides, blends, and compounds.
        </p>
      </header>

      <div className="mt-10">
        <Suspense fallback={null}>
          <CatalogToolbar
            productTypes={productTypes}
            total={result.total}
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
