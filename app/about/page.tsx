import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description: "Cellova Labs is a research-products company supplying clearly documented research materials to the scientific community.",
  path: "/about",
});

const PRINCIPLES = [
  ["01", "Documentation-led", "We organize product specifications, storage guidance, and available batch records so researchers can review the material before placing an order."],
  ["02", "Research focused", "Our catalog is presented for laboratory and analytical investigation, with plain language that keeps intended-use boundaries visible."],
  ["03", "Provider-connected", "Catalog, availability, pricing, and documentation remain connected to the active commerce provider rather than being re-entered into storefront copy."],
] as const;

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <Breadcrumbs items={[{ name: "About", path: "/about" }]} />

        <header className="relative mt-8 overflow-hidden rounded-[18px] border border-ink-soft/25 bg-ink px-6 py-12 text-paper shadow-[0_26px_54px_-38px_rgba(18,20,28,.76)] sm:px-10 sm:py-16 lg:px-14">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_70%_40%,rgba(242,166,60,.24),transparent_25%),linear-gradient(135deg,transparent,rgba(45,52,82,.95))]" />
          <svg className="pointer-events-none absolute -right-16 -top-12 h-[26rem] w-[26rem] text-brand/30" viewBox="0 0 400 400" fill="none" aria-hidden="true"><circle cx="200" cy="200" r="160" stroke="currentColor" strokeWidth="1" /><ellipse cx="200" cy="200" rx="158" ry="92" stroke="currentColor" strokeWidth="1" transform="rotate(-35 200 200)" /><ellipse cx="200" cy="200" rx="158" ry="92" stroke="currentColor" strokeWidth="1" transform="rotate(35 200 200)" /><circle cx="92" cy="117" r="5" fill="currentColor" /><circle cx="327" cy="250" r="6" fill="currentColor" /></svg>
          <div className="relative max-w-3xl">
            <p className="section-eyebrow text-brand-bright before:bg-brand">About Cellova Labs</p>
            <h1 className="mt-5 max-w-3xl text-paper">A clearer research-materials experience.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-paper/80">Cellova Labs is built for researchers who need straightforward access to research materials alongside the product, batch, and handling details available for each record.</p>
            <div className="mt-9 flex flex-wrap gap-3"><Link href="/products" className="inline-flex items-center bg-brand px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-brand-bright">Browse the catalog <span className="ml-2" aria-hidden="true">→</span></Link><Link href="/coa-library" className="inline-flex items-center border border-paper/35 bg-paper/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-paper/10">Review COAs <span className="ml-2" aria-hidden="true">→</span></Link></div>
          </div>
        </header>

        <section className="mt-14 grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-start" aria-labelledby="about-principles-heading">
          <div className="lg:sticky lg:top-28"><p className="section-eyebrow">How we work</p><h2 id="about-principles-heading" className="mt-4 max-w-md">Research context, kept visible.</h2><p className="mt-5 max-w-md text-slate">The storefront is designed to make catalog data and available documentation easier to review without introducing therapeutic, diagnostic, or performance claims.</p><Link href="/coa-library" className="mt-7 inline-flex items-center text-sm font-semibold text-brand-deep hover:text-brand">Explore the COA Library <span className="ml-2" aria-hidden="true">→</span></Link></div>
          <div className="grid gap-4 sm:grid-cols-3">{PRINCIPLES.map(([number, title, body]) => <article key={number} className="rounded-[12px] border border-line bg-paper p-5 shadow-[0_18px_36px_-32px_rgba(18,20,28,.42)]"><p className="font-mono text-xs font-semibold tracking-[.16em] text-brand-deep">{number}</p><h3 className="mt-7 text-xl">{title}</h3><p className="mt-3 text-sm leading-6 text-slate">{body}</p></article>)}</div>
        </section>

        <section className="mt-14 rounded-[14px] border border-line bg-mist p-6 sm:p-9" aria-labelledby="research-boundaries-heading"><div className="grid gap-8 lg:grid-cols-[1fr_.9fr]"><div><p className="section-eyebrow">Research boundaries</p><h2 id="research-boundaries-heading" className="mt-4">Clear on intended use.</h2><p className="mt-5 max-w-2xl text-slate">Cellova Labs supplies products for research, laboratory, and analytical purposes only. Product information is not intended to diagnose, treat, cure, or prevent disease, and products are not for human or animal consumption.</p></div><div className="rounded-[10px] border border-ink-soft/20 bg-paper p-5"><h3 className="text-lg">Available documentation</h3><p className="mt-3 text-sm leading-6 text-slate">Where an applicable batch record has been assigned through the active provider, the product page and COA Library make it available for review.</p><Link href="/products" className="mt-5 inline-flex text-sm font-semibold text-brand-deep hover:text-brand">View research materials <span className="ml-2" aria-hidden="true">→</span></Link></div></div></section>
      </div>
    </main>
  );
}
