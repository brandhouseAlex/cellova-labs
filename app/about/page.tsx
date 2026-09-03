import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Cellova Labs is a research-products company supplying verified peptides, blends, and laboratory materials to the scientific research community.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <Breadcrumbs items={[{ name: "About", path: "/about" }]} />

        {/* About page style: structured Cellova research dossier, not consumer marketing. */}
        <header className="relative mt-8 overflow-hidden rounded-[16px] border border-[#D8DCE3] bg-gradient-to-br from-[#F3F4F1] via-paper to-[#FFF1DB] px-6 py-10 shadow-[0_24px_48px_-40px_rgba(32,32,32,.42)] sm:px-10 sm:py-14 lg:px-14">
          <svg className="pointer-events-none absolute -right-20 -top-20 h-[30rem] w-[30rem] text-brand/15" viewBox="0 0 400 400" fill="none" aria-hidden="true"><circle cx="200" cy="200" r="160" stroke="currentColor" strokeWidth="1"/><ellipse cx="200" cy="200" rx="158" ry="92" stroke="currentColor" strokeWidth="1" transform="rotate(-35 200 200)"/><ellipse cx="200" cy="200" rx="158" ry="92" stroke="currentColor" strokeWidth="1" transform="rotate(35 200 200)"/><circle cx="92" cy="117" r="5" fill="currentColor"/><circle cx="327" cy="250" r="6" fill="currentColor"/></svg>
          <div className="relative max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">Cellova Labs · Research Dossier</p><h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl lg:text-6xl">Built for the standards of modern research.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate">Cellova Labs supplies research-grade peptides, blends, reference compounds, and laboratory essentials for research organizations that require clear documentation alongside every material.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/products" className="bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-brand-deep">Browse catalog</Link><Link href="/coa-library" className="border border-brand/55 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-deep transition-colors hover:bg-brand-tint">Review COAs</Link></div></div>
        </header>

        <section className="mt-14 grid gap-5 lg:grid-cols-[.85fr_1.15fr]" aria-labelledby="about-principles">
          <div className="rounded-[12px] bg-[#12141C] p-7 text-paper sm:p-9"><p className="text-xs font-semibold uppercase tracking-[.24em] text-[#F8C36A]">Operating principle</p><h2 id="about-principles" className="mt-4 font-display text-3xl font-semibold leading-tight">Documentation before marketing.</h2><p className="mt-6 max-w-md text-sm leading-7 text-paper/80">We believe a research supplier should be judged by the quality of its records, not the volume of its claims.</p><div className="mt-8 border-t border-white/15 pt-5 text-[11px] font-semibold uppercase tracking-[.16em] text-[#F8C36A]">Batch detail · traceability · research readiness</div></div>
          <div className="grid gap-5 sm:grid-cols-2"><DossierCard number="01" title="Research focus" body="The catalog centers on research peptides supplied for in-vitro and analytical investigation."/><DossierCard number="02" title="Clear records" body="Product pages present the specifications, storage information, and available batch documentation a laboratory needs."/><DossierCard number="03" title="Responsible distribution" body="Research-use acknowledgement, age confirmation, and clear labeling remain central to the ordering experience."/><DossierCard number="04" title="Neutral language" body="We do not make therapeutic, diagnostic, or performance claims, and materials are not for human or veterinary use."/></div>
        </section>

        <section className="mt-14 rounded-[14px] border border-line bg-mist p-7 sm:p-10" aria-labelledby="standards"><div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.24em] text-brand">Standards</p><h2 id="standards" className="mt-3 font-display text-3xl font-semibold text-ink">Quality, transparency, integrity.</h2></div><Link href="/coa-library" className="text-sm font-semibold text-brand-deep hover:underline">Explore COA Library →</Link></div><p className="mt-7 max-w-3xl text-sm leading-7 text-slate">Cellova Labs does not claim FDA approval, GMP certification, or specific laboratory accreditations on this page. Verified certifications and registrations will be published as they are formally obtained.</p></section>
      </div>
    </div>
  );
}

function DossierCard({ number, title, body }: { number: string; title: string; body: string }) { return <article className="rounded-[12px] border border-line bg-paper p-5 shadow-[0_18px_36px_-30px_rgba(32,32,32,.36)]"><p className="text-xs font-semibold tracking-[.16em] text-brand">{number}</p><h3 className="mt-5 font-display text-lg font-semibold text-ink">{title}</h3><p className="mt-3 text-sm leading-6 text-slate">{body}</p></article>; }
