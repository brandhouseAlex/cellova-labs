import type { Product } from "@/lib/commerce/types";
import { ProductCard } from "./product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) return <div className="surface relative overflow-hidden py-14 text-center"><i className="absolute left-1/2 top-0 h-1 w-28 -translate-x-1/2 bg-[color:var(--spark)]" /><p className="eyebrow">Controlled catalog release</p><h2 className="mt-3 font-display text-2xl tracking-tight text-[color:var(--indigo)]">The current selection is being prepared.</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[color:var(--muted)]">Product listings are released from the active commerce provider only after their specifications and documentation are available.</p></div>;
  return <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
