import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { HeroOrbit } from "@/components/home/hero-orbit";
import { HomeProductGrid } from "@/components/home/home-product-grid";
import { ResearchFormats } from "@/components/home/research-formats";
import { TransparencyCoa } from "@/components/home/transparency-coa";
import { CatalogToDelivery } from "@/components/home/catalog-to-delivery";

/**
 * Homepage restoration style: an editorial warm-cream field, large left HTML
 * copy, exact supplied product media on the right, and restrained Cellova-amber
 * scientific orbit motion. The trust strip is intentionally attached below.
 */
export const metadata = buildMetadata({
  title: "Cellova Labs — Research-Grade Peptides & Laboratory Materials",
  description:
    "Cellova Labs supplies research-grade peptides, blends, and laboratory materials with independent third-party analytical verification. Research use only.",
  path: "/",
});

const TRUST_CREDENTIALS = [
  { value: "99%+", label: "Purity Guaranteed", icon: "shield" },
  { value: "Third-Party", label: "Tested", icon: "flask" },
  { value: "USA", label: "Manufactured in Texas", icon: "pin" },
  { value: "COAs", label: "On Every Batch", icon: "document" },
] as const;

function TrustIcon({ name }: { name: (typeof TRUST_CREDENTIALS)[number]["icon"] }) {
  const paths = {
    shield: "M12 3l7 3v5c0 4.4-3 8.4-7 10-4-1.6-7-5.6-7-10V6l7-3z M8.8 12.1l2.1 2.1 4.5-4.7",
    flask: "M9 3h6M10 3v6L5.2 18a2 2 0 0 0 1.7 3h10.2a2 2 0 0 0 1.7-3L14 9V3M8.1 16h7.8",
    pin: "M20 10c0 5.1-8 11-8 11S4 15.1 4 10a8 8 0 1 1 16 0ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
    document: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h5M10 17h5",
  } as const;

  return <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0 text-brand-bright sm:h-9 sm:w-9" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}

export default async function HomePage() {
  return <>
    <section className="home-premium-hero relative isolate overflow-hidden border-b border-black/5 bg-[#F3F4F1]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_76%_48%,rgba(240,246,234,0.78),transparent_44%),linear-gradient(120deg,#F3F4F1_0%,#F3F4F1_49%,#FFF1DB_100%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-y-0 left-0 w-[61%] bg-gradient-to-r from-[#F3F4F1] via-[#F3F4F1]/95 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-[#F3F4F1] via-[#F3F4F1]/90 to-transparent" />
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 left-[48%] hidden overflow-hidden lg:block" aria-hidden="true"><HeroOrbit /></div>

      <div className="home-page-container relative grid min-h-[40rem] grid-cols-1 py-14 lg:min-h-[40.5rem] lg:grid-cols-[45%_55%] lg:py-0">
        <div className="relative z-30 flex max-w-xl flex-col justify-center lg:pb-10">
          <p className="home-hero-enter home-hero-enter--1 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.19em] text-brand-deep sm:text-sm"><span>Advancing Research</span><span className="home-hero-separator" aria-hidden="true" /><span>Empowering Discovery</span></p>
          <h1 className="home-hero-enter home-hero-enter--2 mt-7 font-display text-[2.8rem] font-semibold leading-[0.98] tracking-[-0.055em] text-ink sm:text-6xl lg:text-[4.55rem]">Premium Compounds.<br /><span className="text-[#F2A63C]">Proven Purity.</span></h1>
          <p className="home-hero-enter home-hero-enter--3 mt-7 max-w-[30rem] text-lg leading-[1.55] text-[#30322f] sm:text-xl">We provide premium research compounds and peptides manufactured in the USA and tested to the highest standards.</p>
          <div className="home-hero-enter home-hero-enter--4 mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/products" className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-[5px] bg-[#F2A63C] px-7 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_10px_20px_-15px_rgba(37,75,12,0.8)] transition-colors duration-200 hover:bg-[#3f6919] active:scale-[0.98]">Browse Catalog <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">→</span></Link>
            <Link href="/coa-library" className="inline-flex min-h-14 items-center justify-center rounded-[5px] border border-[#40423f]/70 bg-white/40 px-7 text-sm font-semibold uppercase tracking-[0.08em] text-ink transition-colors duration-200 hover:border-[#F2A63C] hover:bg-[#FFF1DB] active:scale-[0.98]">View COAs</Link>
          </div>
        </div>

        <div className="home-product-stage relative z-20 mt-8 min-h-[22rem] overflow-hidden sm:min-h-[28rem] lg:mt-0 lg:min-h-0" aria-label="Future Cellova Labs product composition area">
          <div className="home-hero-future-media absolute inset-0" aria-hidden="true" />
        </div>
      </div>
    </section>

    <section className="home-trust-strip relative overflow-hidden bg-[#12141C] text-[#F3F4F1]" aria-label="Cellova Labs quality credentials">
      <div className="home-page-container grid grid-cols-2 lg:grid-cols-4">
        {TRUST_CREDENTIALS.map((credential, index) => <div key={credential.value} className={`flex min-h-28 items-center gap-4 py-6 ${index > 0 ? "lg:border-l lg:border-[#3D466A] lg:pl-10" : ""} ${index > 1 ? "border-t border-[#3D466A] lg:border-t-0" : ""} ${index === 1 ? "border-l border-[#3D466A]" : ""} ${index % 2 === 0 ? "pr-3 lg:pr-10" : "pl-5 lg:pl-10"}`}>
          <TrustIcon name={credential.icon} />
          <p className="text-[11px] font-semibold uppercase leading-5 tracking-[0.1em] text-[#F3F4F1] sm:text-xs"><span className="block text-sm tracking-[0.08em] text-white">{credential.value}</span>{credential.label}</p>
        </div>)}
      </div>
      <div className="home-scan-line pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[#2D3452]" aria-hidden="true" />
    </section>
    <ResearchFormats />
    <HomeProductGrid />
    <TransparencyCoa />
    <CatalogToDelivery />
  </>;
}
