import type { Metadata } from "next";
import { CatalogExplorer } from "@/components/storefront/catalog-explorer";
import { CatalogGate } from "@/components/storefront/catalog-gate";
import { requireCatalogAccess } from "@/lib/commerce/gate";
import { getCommerceAdapter } from "@/lib/commerce/provider";
import type { ProductPage } from "@/lib/commerce/types";

export const metadata: Metadata = { title: "Shop All", description: "Explore the Cellova Labs catalog and review clear product specifications." };
export default async function ShopPage() { if (!(await requireCatalogAccess())) return <CatalogGate />; let page: ProductPage = { products: [], nextCursor: null, hasNextPage: false }; try { page = await (await getCommerceAdapter()).getProductPage({ first: 12 }); } catch { /* The explorer renders a clear empty state. */ } return <section className="section"><div className="container"><p className="eyebrow">Catalog / all formats</p><h1 className="font-display mt-3 text-4xl tracking-[-0.045em] text-[color:var(--indigo)] sm:text-5xl">Shop all products.</h1><p className="mt-4 max-w-xl text-sm leading-7 text-[color:var(--muted)]">Search, compare, and review currently available product information from the active commerce provider.</p><div className="mt-10"><CatalogExplorer products={page.products} initialNextCursor={page.nextCursor} initialHasNextPage={page.hasNextPage} /></div></div></section>; }
