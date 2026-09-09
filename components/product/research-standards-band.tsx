import Link from "next/link";

const STANDARDS = [
  { icon: "microscope", title: "Research-Grade Materials", detail: "Manufactured to meet the highest standards." },
  { icon: "shield", title: "Third-Party Tested", detail: "Independently verified for purity and quality." },
  { icon: "box", title: "Secure Packaging", detail: "Discreet and protected from our facility to you." },
  { icon: "support", title: "Dedicated Support", detail: "Questions? We’re here to help." },
] as const;

export function ResearchStandardsBand() {
  return (
    <section className="relative mt-8 overflow-hidden rounded-[20px] border border-[rgba(139,147,167,.22)] bg-[#F7F7F4] shadow-[0_10px_22px_-22px_rgba(18,20,28,.2)]" aria-labelledby="research-standards-heading">
      <MolecularCorner />
      <div className="relative grid lg:min-h-[238px] lg:grid-cols-[32%_repeat(4,minmax(0,1fr))]">
        <div className="relative overflow-hidden bg-[#2D3452] px-7 py-8 text-paper sm:px-9 lg:px-9 lg:[border-bottom-right-radius:2rem_6rem]">
          <div className="relative max-w-[16.25rem]">
            <h2 id="research-standards-heading" className="font-display text-[2rem] font-semibold leading-[.96] tracking-[-.045em] text-paper sm:text-[2.2rem] lg:text-[2.35rem]">Built for<br /><span className="text-[#F2A63C]">serious research.</span></h2>
            <p className="mt-3 text-[15px] leading-5 text-[#F3F4F1]/82">Research-grade materials. Clear specifications.<br />A higher standard for what&apos;s next.</p>
            <Link href="/policies/research-use" className="mt-5 inline-flex min-h-11 items-center gap-4 rounded-[6px] border border-paper/80 px-5 text-[11px] font-semibold uppercase tracking-[.08em] text-paper transition-colors hover:border-[#F2A63C] hover:bg-[#F2A63C] hover:text-[#2D3452]">Our Standards <span className="text-xl leading-none" aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className="grid grid-cols-2 bg-[#F7F7F4] max-[359px]:grid-cols-1 lg:col-span-4 lg:grid-cols-4">
          {STANDARDS.map((item, index) => (
            <article key={item.title} className="relative flex min-h-[10.75rem] flex-col items-center justify-center border-[#D8DCE3] px-6 py-7 text-center even:border-l [&:nth-child(-n+2)]:border-b max-[359px]:even:border-l-0 max-[359px]:[&:not(:last-child)]:border-b sm:px-5 lg:min-h-0 lg:border-0 lg:px-4 lg:py-6 xl:px-5">
              {index > 0 ? <span aria-hidden="true" className="absolute bottom-10 left-0 top-10 hidden w-px bg-[#D8DCE3] lg:block" /> : null}
              <StandardsIcon name={item.icon} className="h-9 w-9 text-[#2D3452]" />
              <h3 className="mt-3 max-w-[9.5rem] text-[11px] font-bold uppercase leading-[1.35] tracking-[.045em] text-[#2D3452]">{item.title}</h3>
              <p className="mt-2 max-w-[10.5rem] text-[13px] leading-[1.45] text-[#69738B]">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MolecularCorner() {
  return (
    <svg viewBox="0 0 170 238" className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden h-full w-40 text-[#8B93A7]/45 lg:block" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <path d="M150 0 128 31l25 30-35 25 23 33-33 25 26 31-28 32M170 41l-17 20 17 15M170 178l-36-3-26 31-28-11" />
      <path d="m128 31-26-15-20 24M108 144-24 12-26 31" />
      {[[150, 0], [128, 31], [153, 61], [118, 86], [141, 119], [108, 144], [134, 175], [106, 207], [102, 16], [82, 40], [82, 132], [108, 206]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.25" fill="currentColor" stroke="none" />)}
    </svg>
  );
}

function StandardsIcon({ name, className }: { name: (typeof STANDARDS)[number]["icon"]; className?: string }) {
  const paths = {
    microscope: <><path d="M7 20h12M12 4a3 3 0 0 1 3 3v3h-6V7a3 3 0 0 1 3-3ZM9 10h6v3a5 5 0 0 1-5 5H7v-3h3a2 2 0 0 0 2-2v-3Z" /><path d="m6 8 3 2M17 4l2 2M7 18H5" /></>,
    shield: <><path d="M12 3 19 6v5c0 4.4-3 8.4-7 10-4-1.6-7-5.6-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" /></>,
    box: <><path d="m4 7 8-4 8 4v10l-8 4-8-4ZM4 7l8 4 8-4M12 11v10" /></>,
    support: <><path d="M5 17.5V12a7 7 0 0 1 14 0v5.5M5 13H3.5v4.5H7V13H5ZM19 13h1.5v4.5H17V13h2ZM17 19c0 1.1-.9 2-2 2h-2" /></>,
  } as const;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{paths[name]}</svg>;
}
