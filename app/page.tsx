import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";
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
  return <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#2D3452]" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{content[icon]}</svg>;
}

export function HeroProductImage() {
  return (
    <div className="relative min-h-[23rem] overflow-hidden rounded-[20px] bg-[#E9ECEB] shadow-[0_20px_42px_-30px_rgba(45,52,82,.55)] sm:min-h-[29rem] lg:min-h-[29rem]">
      <Image
        src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663938836977/soQIwZUdfXIdMSCv.png"
        alt="Cellova Labs research product lineup"
        fill
        priority
        unoptimized
        sizes="(min-width: 1024px) 56vw, 100vw"
        className="object-cover object-center"
      />
    </div>
  );
}

export default async function HomePage() {
  return <>
    <section className="border-b border-black/[.07] bg-[#F7F7F4]">
      <div className="home-page-container grid gap-10 py-8 lg:min-h-[31.5rem] lg:grid-cols-[39%_61%] lg:items-center lg:gap-12 lg:py-5">
        <div className="max-w-[31rem] lg:py-6">
          <p className="section-eyebrow !text-[#2D3452]">Research-Focused. Quality Driven.</p>
          <h1 className="mt-5 font-display text-[clamp(3rem,4.2vw,5rem)] font-bold leading-[.98] tracking-[-.06em] text-ink">Precision you<br />can <span className="text-[#F2A63C]">verify.</span></h1>
          <p className="mt-5 max-w-[28rem] text-[15px] font-medium leading-7 text-[#2D3452] sm:text-base">Premium quality peptides and compounds backed by third-party testing, transparent documentation, and dependable support for researchers nationwide.</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Cellova quality assurances">
            {["USA Made", "Third-party tested", "COAs available"].map((item) => <li key={item} className="inline-flex items-center gap-2 rounded-full border border-[#8B93A7]/45 bg-paper px-3 py-2 text-xs font-semibold text-[#2D3452]"><span className="text-sm leading-none text-[#F2A63C]">✓</span>{item}</li>)}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/products" className="inline-flex min-h-12 items-center gap-3 rounded-[7px] bg-[#2D3452] px-6 text-sm font-bold text-paper shadow-[0_8px_16px_-12px_rgba(45,52,82,.8)] transition-colors hover:bg-[#F2A63C] hover:text-[#2D3452] active:scale-[.98]">Browse Peptides <span aria-hidden="true">→</span></Link>
            <Link href="/coa-library" className="inline-flex min-h-12 items-center gap-3 rounded-[7px] border border-[#8B93A7]/55 bg-paper px-6 text-sm font-bold text-[#2D3452] transition-colors hover:border-[#F2A63C] hover:bg-[#F2A63C]/10 active:scale-[.98]">View COA Library <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <HeroProductImage />
      </div>
    </section>

    <section className="bg-[#F7F7F4] pb-7 pt-2" aria-label="Cellova service assurances">
      <div className="home-page-container grid overflow-hidden rounded-[8px] border border-[#8B93A7]/45 bg-[#2D3452] sm:grid-cols-2 lg:grid-cols-3">
        {ASSURANCES.map((item, index) => <article key={item.title} className={`flex min-h-[8.2rem] gap-4 px-5 py-5 ${index > 0 ? "lg:border-l lg:border-[#8B93A7]/45" : ""} ${index === 2 ? "border-t border-[#8B93A7]/45 lg:border-t-0" : ""} ${index === 1 ? "sm:border-l sm:border-[#8B93A7]/45 lg:border-l" : ""}`}>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[15px] bg-[#F2A63C] shadow-[0_4px_12px_rgba(18,20,28,.2)]"><AssuranceIcon icon={item.icon} /></span>
          <div><h2 className="text-sm font-bold text-paper">{item.title}</h2><p className="mt-1.5 text-xs font-medium leading-5 text-[#8B93A7]">{item.detail}</p></div>
        </article>)}
      </div>
    </section>

    <ResearchFormats />
    <HomeProductGrid />
    <TransparencyCoa />
  </>;
}
