import Link from "next/link";

const STANDARDS = [
  { icon: "microscope", title: "Research-Grade Materials", detail: "Manufactured to meet the highest standards." },
  { icon: "shield", title: "Third-Party Tested", detail: "Independently verified for purity and quality." },
  { icon: "box", title: "Secure Packaging", detail: "Discreet and protected from our facility to you." },
  { icon: "support", title: "Dedicated Support", detail: "Questions? We’re here to help." },
] as const;

export function ResearchStandardsBand() {
  return (
    <section className="relative mt-8 overflow-hidden rounded-[12px] border border-[#D8DCE3] bg-[#F7F7F4] shadow-[0_16px_32px_-27px_rgba(18,20,28,.26)]" aria-labelledby="research-standards-heading">
      <MolecularCorner />
      <div className="relative grid lg:grid-cols-[2.05fr_repeat(4,minmax(0,1fr))]">
        <div className="relative overflow-hidden bg-[#2D3452] px-6 py-7 text-paper sm:px-8 lg:overflow-visible lg:px-7 xl:px-9">
          <div className="pointer-events-none absolute -right-16 inset-y-0 hidden w-32 rounded-r-[100%] bg-[#2D3452] lg:block" />
          <div className="relative max-w-[16.25rem]">
            <h2 id="research-standards-heading" className="font-display text-[1.75rem] font-semibold leading-[.98] tracking-[-.045em] text-paper sm:text-[2rem]">Built for<br /><span className="text-[#F2A63C]">serious research.</span></h2>
            <p className="mt-3 text-sm leading-5 text-[#F3F4F1]/80">Research-grade materials. Clear specifications. A higher standard for what’s next.</p>
            <Link href="/policies/research-use" className="mt-5 inline-flex min-h-10 items-center gap-3 rounded-[6px] border border-paper/80 px-4 text-xs font-semibold uppercase tracking-[.08em] text-paper transition-colors hover:border-[#F2A63C] hover:bg-[#F2A63C] hover:text-[#2D3452]">Our Standards <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-y divide-[#D8DCE3] bg-[#F7F7F4] sm:grid-cols-4 sm:divide-y-0 lg:col-span-4">
          {STANDARDS.map((item) => (
            <article key={item.title} className="flex min-h-[10.25rem] flex-col items-center px-3 py-5 text-center sm:px-4 lg:px-3 xl:px-5">
              <StandardsIcon name={item.icon} className="h-9 w-9 text-[#2D3452]" />
              <h3 className="mt-3 max-w-[9rem] text-[10px] font-bold uppercase leading-4 tracking-[.07em] text-[#2D3452]">{item.title}</h3>
              <p className="mt-2 max-w-[10rem] text-xs leading-4 text-[#8B93A7]">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MolecularCorner() {
  return (
    <svg viewBox="0 0 220 130" className="pointer-events-none absolute -bottom-7 -right-7 z-0 hidden h-36 w-56 text-[#8B93A7]/35 lg:block" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <path d="M16 109 53 79l36 19 35-40 36 18 39-42" />
      <path d="m53 79 4-44 46 23M124 58l3-39 33 20" />
      {[[16, 109], [53, 79], [57, 35], [89, 98], [103, 58], [124, 58], [127, 19], [160, 76], [199, 34]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.5" fill="currentColor" stroke="none" />)}
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
