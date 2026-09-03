"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "alphabetical", label: "Alphabetically A–Z" },
  { value: "alphabetical-desc", label: "Alphabetically Z–A" },
];

/**
 * Catalog style: URL-driven, three-control clinical toolbar. The controls only
 * change normalized-provider query inputs; no local product data is introduced.
 */
export function CatalogToolbar({
  productTypes,
  total,
  basePath = "/products",
  collectionLabel,
}: {
  productTypes: string[];
  total: number;
  basePath?: string;
  collectionLabel?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [term, setTerm] = useState(searchParams.get("q") ?? "");
  const currentSort = searchParams.get("sort") ?? "featured";
  const currentType = searchParams.get("type") ?? "";

  function navigate(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    const query = params.toString();
    startTransition(() => router.push(query ? `${basePath}?${query}` : basePath));
  }

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    navigate({ q: term.trim() });
  }

  const selectClass = cn(
    "w-full appearance-none rounded-[16px] border border-line bg-paper px-5 py-3.5 pr-10 text-sm text-ink shadow-[0_8px_18px_-22px_rgba(32,32,32,0.35)]",
    "focus:border-brand focus:outline-none disabled:opacity-50"
  );

  return <section className="rounded-[16px] border border-line bg-[#F3F4F1] p-5 shadow-[0_16px_34px_-34px_rgba(32,32,32,0.45)] sm:p-6 lg:p-7" aria-label="Catalog filters">
    <div className="grid gap-5 lg:grid-cols-[1.1fr_.88fr_.95fr] lg:items-end">
      <form role="search" onSubmit={submitSearch}>
        <label htmlFor="catalog-search" className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate">Search</label>
        <div className="flex overflow-hidden rounded-[16px] border border-line bg-paper shadow-[0_8px_18px_-22px_rgba(32,32,32,0.35)]">
          <input id="catalog-search" type="search" value={term} onChange={(event) => setTerm(event.target.value)} placeholder="Search products..." className="w-full min-w-0 bg-paper px-5 py-3.5 text-sm text-ink outline-none placeholder:text-silver focus:ring-1 focus:ring-brand" />
          <button type="submit" disabled={isPending} className="m-1 shrink-0 rounded-[12px] bg-ink px-6 text-xs font-semibold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-graphite disabled:opacity-50">Go</button>
        </div>
      </form>
      <div>
        <label htmlFor="catalog-type" className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate">{collectionLabel ? `${collectionLabel} type` : "Product Type"}</label>
        <select id="catalog-type" value={currentType} disabled={isPending} onChange={(event) => navigate({ type: event.target.value })} className={selectClass}>
          <option value="">{collectionLabel ? `All ${collectionLabel.toLowerCase()}` : "All types"}</option>
          {productTypes.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="catalog-sort" className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate">Sort</label>
        <select id="catalog-sort" value={currentSort} disabled={isPending} onChange={(event) => navigate({ sort: event.target.value })} className={selectClass}>
          {SORTS.map((sort) => <option key={sort.value} value={sort.value}>{sort.label}</option>)}
        </select>
      </div>
    </div>
    <p className="mt-5 text-sm text-slate" role="status">{isPending ? "Updating results…" : `${total} product${total === 1 ? "" : "s"}`}</p>
  </section>;
}
