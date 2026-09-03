import Link from "next/link";
import { ArrowDown, ArrowUpRight, ClipboardCheck, FileCheck2, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { CellovaLogo } from "@/components/brand/cellova-logo";
import { CategoryCards } from "@/components/storefront/category-cards";
import { ProductGrid } from "@/components/storefront/product-grid";
import { ProductStillLife } from "@/components/storefront/product-still-life";
import { getCommerceAdapter } from "@/lib/commerce/provider";
import type { Product } from "@/lib/commerce/types";

const qualityPoints = [{ label: "Clear specifications", icon: ClipboardCheck }, { label: "Batch documentation", icon: FileCheck2 }, { label: "Third-party testing", icon: ShieldCheck }, { label: "Secure checkout", icon: PackageCheck }, { label: "Careful fulfillment", icon: Truck }];

export default async function HomePage() {
  let featuredProducts: Product[] = [];
  try { featuredProducts = await (await getCommerceAdapter()).getProducts({ first: 4 }); } catch { /* The designed fallback is intentionally customer-safe. */ }
  return <>
    <section className="overflow-hidden bg-[color:var(--paper)] pb-10 pt-10 sm:pb-14 sm:pt-14">
      <div className="container grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
        <div className="max-w-xl"><div className="w-[12rem]"><CellovaLogo priority /></div><p className="eyebrow mt-10">Research-grade storefront</p><h1 className="font-display mt-4 text-[clamp(2.75rem,6vw,5.4rem)] font-bold leading-[1.04] tracking-[-0.06em] text-[color:var(--indigo)]">Precision You<br className="hidden sm:block" /> Can Verify.</h1><p className="mt-6 max-w-md text-[1.05rem] leading-8 text-[color:var(--muted)]">Clear specifications, organized documentation, and dependable research support.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/shop" className="button-primary">View catalog <ArrowUpRight size={15} /></Link><Link href="/coa-library" className="button-secondary">Documentation</Link></div><div className="mt-14 hidden items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[color:var(--indigo)] sm:flex"><ArrowDown size={15} className="text-[color:var(--spark)]" /> Scroll to explore</div></div>
        <ProductStillLife />
      </div>
    </section>
    <section className="border-y border-[color:var(--line)] bg-white"><div className="container grid grid-cols-2 gap-x-5 gap-y-6 py-7 sm:grid-cols-3 lg:grid-cols-5">{qualityPoints.map(({ label, icon: Icon }) => <div key={label} className="flex items-center gap-3"><Icon size={20} strokeWidth={1.35} className="text-[color:var(--spark)]" /><span className="text-[0.69rem] font-bold uppercase leading-5 tracking-[0.055em] text-[color:var(--indigo)]">{label}</span></div>)}</div></section>
    <section className="section"><div className="container"><div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Shop by format</p><h2 className="font-display mt-3 text-3xl tracking-[-0.04em] text-[color:var(--indigo)] sm:text-4xl">Designed to be<br />easy to compare.</h2></div><p className="max-w-xs text-sm leading-6 text-[color:var(--muted)]">Find a clear path to the format that fits your documented research workflow.</p></div><CategoryCards /></div></section>
    <section className="section bg-[color:var(--indigo)] text-[color:var(--paper)]"><div className="container"><div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Featured products</p><h2 className="font-display mt-3 text-3xl tracking-[-0.04em] sm:text-4xl">Current selection.</h2></div><Link href="/shop" className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-[color:var(--spark)]">View full catalog <ArrowUpRight size={15} /></Link></div><ProductGrid products={featuredProducts} /></div></section>
    <section className="section"><div className="container dark-surface overflow-hidden px-7 py-10 text-[color:var(--paper)] sm:px-12 sm:py-14"><div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]"><div><p className="eyebrow">Documentation first</p><h2 className="font-display mt-3 max-w-2xl text-3xl tracking-[-0.045em] sm:text-4xl">Every record is organized for review.</h2><p className="mt-4 max-w-xl text-sm leading-7 text-[#c0c4ce]">Product documentation and certificate records are shown only when they are available from the active commerce provider.</p></div><Link href="/coa-library" className="button-primary">Browse COA library <ArrowUpRight size={15} /></Link></div></div></section>
  </>;
}
