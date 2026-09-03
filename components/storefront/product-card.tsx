"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, PackageOpen } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import { priceLabel } from "@/lib/commerce/format";

export function ProductCard({ product }: { product: Product }) {
  const firstImage = product.images[0]; const primaryVariant = product.variants[0];
  return <article className="group overflow-hidden rounded-2xl border border-[color:var(--line)] bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow)]">
    <Link href={`/products/${product.handle}`} className="block p-3" aria-label={`View ${product.title}`}>
      <div className="relative grid aspect-[1/1.02] place-items-center overflow-hidden rounded-xl bg-[color:var(--paper)] p-5">
        {firstImage ? <Image src={firstImage.url} alt={firstImage.altText ?? product.title} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]" /> : <div className="text-center"><PackageOpen className="mx-auto text-[color:var(--slate)]" size={32} strokeWidth={1.3} /><span className="mt-3 block font-mono text-[0.62rem] uppercase tracking-[0.08em] text-[color:var(--muted)]">Image pending</span></div>}
        {primaryVariant && <span className={`absolute left-3 top-3 rounded bg-[color:var(--ink)] px-2 py-1 font-mono text-[0.57rem] uppercase tracking-[0.08em] text-white ${primaryVariant.availableForSale ? "" : "bg-[color:var(--slate)]"}`}>{primaryVariant.availableForSale ? "Available" : "Unavailable"}</span>}
      </div>
    </Link>
    <div className="px-5 pb-5 pt-3 text-center"><p className="font-display text-base tracking-tight text-[color:var(--indigo)]">{product.title}</p>{product.productType && <p className="mt-2 font-mono text-[0.61rem] uppercase tracking-[0.08em] text-[color:var(--slate)]">{product.productType}</p>}<p className="mt-3 text-sm font-bold text-[color:var(--ink)]">{priceLabel(product.priceRange)}</p><Link href={`/products/${product.handle}`} className="mt-5 inline-flex items-center gap-1 text-[0.68rem] font-bold uppercase tracking-[0.075em] text-[color:var(--indigo)] underline decoration-[color:var(--spark)] decoration-2 underline-offset-4">View details <ArrowUpRight size={13} /></Link></div>
  </article>;
}
