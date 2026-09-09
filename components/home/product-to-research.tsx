const STEPS = [
  { number: "1", title: "Select", detail: "Choose your research material" },
  { number: "2", title: "Review", detail: "View specifications and product details" },
  { number: "3", title: "Verify", detail: "Access lot documentation and COAs" },
  { number: "4", title: "Research", detail: "Move forward with confidence" },
] as const;

export function ProductToResearch() {
  return (
    <section className="bg-[#F7F7F4] py-10 sm:py-14" aria-labelledby="product-to-research-heading">
      <div className="home-page-container relative overflow-hidden rounded-[12px] border border-[#E1E4E8] bg-[#FBFBF9] px-6 py-8 shadow-[0_18px_34px_-34px_rgba(45,52,82,.36)] sm:px-8 lg:px-10 lg:py-8">
        <AbstractResearchShape />
        <div className="relative grid gap-7 lg:grid-cols-[minmax(0,32%)_minmax(0,68%)] lg:gap-x-12">
          <div>
            <p className="section-eyebrow !text-[#2D3452]"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#F2A63C] align-middle" aria-hidden="true" />From product to research</p>
            <h2 id="product-to-research-heading" className="mt-3 max-w-[22rem] font-display text-[clamp(2rem,3.2vw,3.25rem)] font-semibold leading-[.98] tracking-[-.05em] text-[#2D3452]">A simpler path<br />from selection to research.</h2>
          </div>
          <p className="max-w-[16rem] self-start text-[14px] font-medium leading-5 text-[#69738B] lg:pt-1">Clear steps. Reliable information.<br />Less friction, more progress.</p>
          <ol className="grid gap-y-5 sm:grid-cols-2 sm:gap-x-8 lg:col-span-2 lg:grid-cols-4 lg:gap-x-0">
            {STEPS.map((step, index) => <li key={step.number} className="relative flex min-w-0 items-start gap-3 lg:px-4 lg:first:pl-0">
              {index > 0 ? <span className="absolute -left-5 top-4 hidden text-2xl leading-none text-[#2D3452] lg:block" aria-hidden="true">→</span> : null}
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2D3452] text-base font-bold text-white">{step.number}</span>
              <span className="min-w-0 pt-0.5"><strong className="block text-[15px] font-semibold leading-5 text-[#2D3452]">{step.title}</strong><span className="mt-0.5 block max-w-[10.5rem] text-[13px] leading-4 text-[#69738B]">{step.detail}</span></span>
            </li>)}
          </ol>
        </div>
      </div>
    </section>
  );
}

function AbstractResearchShape() {
  return <svg viewBox="0 0 430 160" className="pointer-events-none absolute right-0 top-0 hidden h-full w-[38%] text-[#8B93A7]/13 lg:block" fill="currentColor" aria-hidden="true"><path d="M180 6h211l-61 47H130z" /><path d="m208 75 186-2-62 52H149z" /><path d="m176 139 164-2-46 23H132z" /></svg>;
}
