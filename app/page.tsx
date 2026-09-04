import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { HomeProductGrid } from "@/components/home/home-product-grid";
import { ResearchFormats } from "@/components/home/research-formats";
import { TransparencyCoa } from "@/components/home/transparency-coa";

export const metadata = buildMetadata({
  title: "Cellova Labs — Research-Grade Peptides & Laboratory Materials",
  description: "Cellova Labs supplies research-grade peptides, blends, and laboratory materials with independent third-party analytical verification. Research use only.",
  path: "/",
});

const ASSURANCES = [
  { title: "Next-Day Shipping", detail: "Orders placed before 12pm EST (M–F) ship the next business day for faster turnaround", icon: "truck" },
  { title: "On-Time Delivery", detail: "Choose from dependable shipping options with tracked delivery across U.S. orders.", icon: "parcel" },
  { title: "Standards Matter", detail: "Quality-focused materials and disciplined testing help support reliable research outcomes.", icon: "flask" },
] as const;

function AssuranceIcon({ icon }: { icon: (typeof ASSURANCES)[number]["icon"] }) {
  const content = {
    truck: <><path d="M3 6h11v10H3z" /><path d="M14 10h4l3 3v3h-7zM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /></>,
    parcel: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="M4.5 7.8 12 12l7.5-4.2M12 12v9" /></>,
    flask: <><path d="M9 3h6M10 3v6L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3" /><path d="M8 15h8" /></>,
  } as const;
  return <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#D97612]" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{content[icon]}</svg>;
}

function HeroPlaceholder() {
  return <div role="img" aria-label="Hero image placeholder" className="flex min-h-[23rem] items-center justify-center rounded-[20px] bg-[#D9DAE5] text-[#50566B] sm:min-h-[29rem] lg:min-h-0">
    <div className="text-center">
      <svg viewBox="0 0 80 68" className="mx-auto h-16 w-20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="8" y="8" width="64" height="48" rx="5" /><circle cx="27" cy="25" r="5" /><path d="m14 50 18-17 10 10 12-15 12 22" /></svg>
      <p className="mt-3 text-sm font-bold uppercase tracking-[.08em]">Hero Image</p>
      <p className="mt-1 text-xs font-semibold">1920 × 1080</p>
    </div>
  </div>;
}

export default async function HomePage() {
  return <>
    <section className="border-b border-black/[.07] bg-[#F7F7F4]">
      <div className="home-page-container grid gap-10 py-8 lg:min-h-[31.5rem] lg:grid-cols-[39%_61%] lg:items-center lg:gap-12 lg:py-5">
        <div className="max-w-[31rem] lg:py-6">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.12em] text-[#30343F]"><span className="h-2.5 w-2.5 rounded-full bg-[#F27216]" />Research-Focused. Quality Driven.</p>
          <h1 className="mt-5 font-display text-[clamp(3rem,4.2vw,5rem)] font-bold leading-[.98] tracking-[-.06em] text-[#11141F]">Precision you<br />can <span className="text-[#F16D16]">verify.</span></h1>
          <p className="mt-5 max-w-[28rem] text-[15px] font-medium leading-7 text-[#59606D] sm:text-base">Premium quality peptides and compounds backed by third-party testing, transparent documentation, and dependable support for researchers nationwide.</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Cellova quality assurances">
            {["USA Made", "Third-party tested", "COAs available"].map((item) => <li key={item} className="inline-flex items-center gap-2 rounded-full border border-[#D9D9D4] bg-[#F7F7F4] px-3 py-2 text-xs font-semibold text-[#474C57]"><span className="text-sm leading-none text-[#343944]">✓</span>{item}</li>)}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/products" className="inline-flex min-h-12 items-center gap-3 rounded-[7px] bg-[#F16D16] px-6 text-sm font-bold text-white shadow-[0_8px_16px_-12px_rgba(241,109,22,.8)] transition-colors hover:bg-[#D85D0C] active:scale-[.98]">Browse Peptides <span aria-hidden="true">→</span></Link>
            <Link href="/coa-library" className="inline-flex min-h-12 items-center gap-3 rounded-[7px] border border-[#D5D5D0] bg-[#F7F7F4] px-6 text-sm font-bold text-[#222630] transition-colors hover:border-[#F16D16] hover:bg-[#FFF3E8] active:scale-[.98]">View COA Library <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <HeroPlaceholder />
      </div>
    </section>

    <section className="bg-[#F7F7F4] pb-7 pt-2" aria-label="Cellova service assurances">
      <div className="home-page-container grid overflow-hidden rounded-[8px] border border-[#D8DAE2] bg-[#F0F1F5] sm:grid-cols-2 lg:grid-cols-3">
        {ASSURANCES.map((item, index) => <article key={item.title} className={`flex min-h-[8.2rem] gap-4 px-5 py-5 ${index > 0 ? "lg:border-l lg:border-[#D8DAE2]" : ""} ${index === 2 ? "border-t border-[#D8DAE2] lg:border-t-0" : ""} ${index === 1 ? "sm:border-l sm:border-[#D8DAE2] lg:border-l" : ""}`}>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[15px] bg-[#F7F7F4] shadow-[0_4px_12px_rgba(20,25,38,.04)]"><AssuranceIcon icon={item.icon} /></span>
          <div><h2 className="text-sm font-bold text-[#333844]">{item.title}</h2><p className="mt-1.5 text-xs font-medium leading-5 text-[#686F7D]">{item.detail}</p></div>
        </article>)}
      </div>
    </section>

    <ResearchFormats />
    <HomeProductGrid />
    <TransparencyCoa />
  </>;
}
