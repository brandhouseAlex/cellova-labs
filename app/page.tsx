import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { HomeProductGrid } from "@/components/home/home-product-grid";
import { ResearchFormats } from "@/components/home/research-formats";
import { TransparencyCoa } from "@/components/home/transparency-coa";
import { ProductToResearch } from "@/components/home/product-to-research";

export const metadata = buildMetadata({
  title: "Cellova Labs — Research-Grade Peptides & Laboratory Materials",
  description: "Cellova Labs supplies research-grade peptides, blends, and laboratory materials with independent third-party analytical verification. Research use only.",
  path: "/",
});

const ASSURANCES = [
  { title: "99%+ Purity", detail: "Lot-specific results", icon: "shield" },
  { title: "Third-party tested", detail: "Independent batch testing", icon: "flask" },
  { title: "Fast U.S. Shipping", detail: "Tracked and dependable", icon: "truck" },
  { title: "U.S.-Based Support", detail: "Helpful service, Monday–Friday", icon: "support" },
] as const;

function AssuranceIcon({ icon }: { icon: (typeof ASSURANCES)[number]["icon"] }) {
  const content = {
    shield: <><path d="M12 3 19 6v5c0 4.4-3 8.4-7 10-4-1.6-7-5.6-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" /></>,
    truck: <><path d="M3 6h11v10H3z" /><path d="M14 10h4l3 3v3h-7zM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /></>,
    flask: <><path d="M9 3h6M10 3v6L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3" /><path d="M8 15h8" /></>,
    support: <><path d="M5 17.5V12a7 7 0 0 1 14 0v5.5M5 13H3.5v4.5H7V13H5ZM19 13h1.5v4.5H17V13h2ZM17 19c0 1.1-.9 2-2 2h-2" /></>,
  } as const;
  return <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#2D3452]" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{content[icon]}</svg>;
}

export function HeroProductImage() {
  return (
    <div className="relative min-h-[23rem] overflow-hidden rounded-[20px] bg-[#E9ECEB] shadow-[0_20px_42px_-30px_rgba(45,52,82,.55)] sm:min-h-[29rem] lg:min-h-[29rem]">
      {/* eslint-disable-next-line @next/next/no-img-element -- supplied campaign visual is served directly to avoid image-optimizer rendering delays. */}
      <img
        src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663938836977/soQIwZUdfXIdMSCv.png"
        alt="Cellova Labs research product lineup"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    </div>
  );
}

export function HeroAssuranceStrip() {
  return (
    <section className="bg-[#F7F7F4] pb-7 pt-2" aria-label="Cellova service assurances">
      <div className="home-page-container grid overflow-hidden rounded-[8px] border border-[#8B93A7]/30 bg-[linear-gradient(105deg,#2D3452_0%,#202945_100%)] shadow-[0_14px_28px_-22px_rgba(45,52,82,.55)] sm:grid-cols-2 lg:grid-cols-4">
        {ASSURANCES.map((item, index) => <article key={item.title} className={`flex min-h-[6.75rem] items-center gap-4 px-5 py-4 ${index > 0 ? "border-t border-[#8B93A7]/35 lg:border-l lg:border-t-0" : ""} ${index % 2 === 1 ? "sm:border-l sm:border-t-0" : ""}`}>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#F2A63C] shadow-[0_4px_12px_rgba(18,20,28,.2)]"><AssuranceIcon icon={item.icon} /></span>
          <div><h2 className="text-sm font-bold text-paper">{item.title}</h2><p className="mt-1 text-xs font-medium leading-5 text-[#8B93A7]">{item.detail}</p></div>
        </article>)}
      </div>
    </section>
  );
}

export default async function HomePage() {
  return <>
    <section className="border-b border-black/[.07] bg-[#F7F7F4]">
      <div className="home-page-container grid gap-10 py-8 lg:min-h-[31.5rem] lg:grid-cols-[minmax(0,39fr)_minmax(0,61fr)] lg:items-center lg:gap-12 lg:py-5">
        <div className="max-w-[31rem] lg:py-6">
          <p className="section-eyebrow !text-[#F2A63C]">Research-Focused. Quality Driven.</p>
          <h1 className="mt-5 font-display text-[clamp(3rem,4.2vw,5rem)] font-bold leading-[.98] tracking-[-.06em] text-ink">Precision you<br />can <span className="text-[#F2A63C]">verify.</span></h1>
          <p className="mt-5 max-w-[28rem] text-[15px] font-medium leading-7 text-[#2D3452] sm:text-base">Premium quality peptides and compounds backed by third-party testing, transparent documentation, and dependable support for researchers nationwide.</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Cellova quality assurances">
            {["USA Made", "Third-party tested", "COAs available"].map((item) => <li key={item} className="inline-flex items-center gap-2 rounded-full border border-[#8B93A7]/45 bg-paper px-3 py-2 text-xs font-semibold text-[#2D3452]"><span className="text-sm leading-none text-[#F2A63C]">✓</span>{item}</li>)}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/products" className="inline-flex min-h-12 items-center gap-3 rounded-[7px] bg-[#2D3452] px-6 text-sm font-bold text-paper shadow-[0_8px_16px_-12px_rgba(45,52,82,.8)] transition-colors hover:bg-[#F2A63C] hover:text-white active:scale-[.98]">Browse Peptides <span aria-hidden="true">→</span></Link>
            <Link href="/coa-library" className="inline-flex min-h-12 items-center gap-3 rounded-[7px] border border-[#8B93A7]/55 bg-paper px-6 text-sm font-bold text-[#2D3452] transition-colors hover:border-[#F2A63C] hover:bg-[#F2A63C]/10 active:scale-[.98]">View COA Library <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <HeroProductImage />
      </div>
    </section>

    <HeroAssuranceStrip />

    <ResearchFormats />
    <HomeProductGrid />
    <TransparencyCoa />
    <ProductToResearch />
  </>;
}
