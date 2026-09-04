import Link from "next/link";

const FORMATS = [
  { title: "Vials", description: "Precision-filled lyophilized peptides", href: "/collections/vials", shape: "vial" },
  { title: "Capsules", description: "Convenient research support", href: "/collections/capsules", shape: "capsule" },
  { title: "Serums", description: "High-purity liquid formulations", href: "/collections/serums", shape: "serum" },
  { title: "Nasal Sprays", description: "Advanced delivery solutions", href: "/collections/sprays", shape: "spray" },
] as const;

function FormatPlaceholder({ shape, title }: { shape: (typeof FORMATS)[number]["shape"]; title: string }) {
  const art = {
    vial: <><rect x="34" y="21" width="32" height="52" rx="4" /><path d="M38 21V13h24v8M36 35h28" /><rect x="38" y="10" width="24" height="5" rx="2" fill="currentColor" stroke="none" /></>,
    capsule: <><rect x="28" y="20" width="44" height="54" rx="9" /><path d="M30 34h40M40 20v-8h20v8" /><rect x="34" y="42" width="32" height="18" rx="2" /></>,
    serum: <><path d="M41 16h18v14h5v44H36V30h5z" /><path d="M41 16h18M38 32h24M43 8h14v8" /><circle cx="50" cy="51" r="7" /></>,
    spray: <><path d="M39 30h23v44H39zM45 30V19h11v11M48 16h16M64 18v9H52" /><path d="M42 43h17" /></>,
  } as const;
  return <div role="img" aria-label={`${title} image placeholder`} className="flex h-28 items-end justify-center text-[#B5BBC8] sm:h-32"><svg viewBox="0 0 100 90" className="h-full w-24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{art[shape]}</svg></div>;
}

export function ResearchFormats() {
  return <section className="border-y border-[#ECECE8] bg-[#F7F7F4] py-10 sm:py-14" aria-labelledby="research-formats-heading">
    <div className="home-page-container grid gap-8 lg:grid-cols-[24.5%_75.5%] lg:gap-10">
      <div className="lg:pt-2">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.12em] text-[#3D4250]"><span className="h-2.5 w-2.5 rounded-full bg-[#F16D16]" />Research Formats</p>
        <h2 id="research-formats-heading" className="mt-4 font-display text-[clamp(2.4rem,3.35vw,3.35rem)] font-bold leading-[1.02] tracking-[-.055em] text-[#12151F]">Multiple formats.<br /><span className="text-[#364A8A]">One standard.</span></h2>
        <p className="mt-3 max-w-[15rem] text-[15px] font-medium leading-6 text-[#69707D]">Choose the format that works best for your research.</p>
        <Link href="/products" className="mt-5 inline-flex min-h-11 items-center gap-3 rounded-[7px] border border-[#D9D9D5] bg-paper px-4 text-sm font-bold text-[#333844] transition-colors hover:border-[#F16D16] hover:bg-[#FFF3E8]">View All Products <span aria-hidden="true">→</span></Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {FORMATS.map((format) => <Link key={format.title} href={format.href} className="group flex min-h-[15rem] flex-col rounded-[13px] border border-[#E2E3E6] bg-paper p-5 text-center transition-all hover:-translate-y-0.5 hover:border-[#F4BD8F] hover:shadow-[0_12px_25px_-20px_rgba(34,38,48,.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F16D16]">
          <FormatPlaceholder shape={format.shape} title={format.title} />
          <h3 className="mt-3 font-display text-xl font-bold tracking-[-.035em] text-[#252A35]">{format.title}</h3>
          <p className="mt-1 min-h-10 text-xs font-medium leading-4 text-[#6D7380]">{format.description}</p>
          <span className="mt-auto pt-3 text-xl text-[#F16D16] transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
        </Link>)}
      </div>
    </div>
  </section>;
}
