/**
 * Cellova's dark verification band. SVG ribbons use only the Cellova Spark palette and
 * move with transform/stroke-dash animation; no stock imagery is introduced.
 */
const verificationSteps = [
  ["01", "COA", "Verified"],
  ["02", "Third-Party", "Tested"],
  ["03", "Endotoxin", "Screened"],
  ["04", "Heavy Metals", "Screened"],
  ["05", "U.S.", "Fulfillment"],
] as const;

export function QualityProcessWave() {
  return (
    <section className="quality-process relative isolate overflow-hidden bg-[#12141C] py-20 text-[#F3F4F1] lg:py-24" aria-labelledby="quality-process-heading">
      <div className="grid-texture pointer-events-none absolute inset-0 opacity-45" aria-hidden="true" />
      <div className="quality-orb quality-orb--one pointer-events-none absolute right-[13%] top-[17%] h-2 w-2 rounded-full bg-[#F8C36A]" aria-hidden="true" />
      <div className="quality-orb quality-orb--two pointer-events-none absolute right-[19%] top-[26%] h-1.5 w-1.5 rounded-full bg-[#F2A63C]" aria-hidden="true" />
      <QualityRibbons />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#F8C36A]">Quality You Can Trust</p>
          <h2 id="quality-process-heading" className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Every Batch. Every Time.</h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#D8DCE3]">Our documented release workflow is designed to ensure every research product is assessed against clear analytical and manufacturing checkpoints before fulfillment.</p>
        </div>
        <ol className="relative mt-14 grid gap-8 sm:grid-cols-5 sm:gap-0">
          <span className="absolute left-[7%] right-[7%] top-5 hidden h-px bg-gradient-to-r from-transparent via-[#F2A63C] to-transparent sm:block" aria-hidden="true" />
          {verificationSteps.map(([number, lineOne, lineTwo], index) => (
            <li key={number} className="quality-step relative flex gap-4 sm:block sm:px-3 sm:text-center" style={{ animationDelay: `${index * 115}ms` }}>
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F2A63C]/80 bg-[#12141C] text-xs font-semibold text-[#F8C36A] shadow-[0_0_0_7px_rgba(32,32,32,0.82)]">{number}</span>
              <p className="pt-1 text-sm font-semibold leading-5 text-[#F3F4F1] sm:mt-5 sm:pt-0"><span className="block">{lineOne}</span><span className="block text-[#F8C36A]">{lineTwo}</span></p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function QualityRibbons() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[43%] overflow-hidden" aria-hidden="true">
      <svg viewBox="0 0 1440 280" preserveAspectRatio="none" className="h-full w-full" fill="none">
        <defs>
          <linearGradient id="qualityWave" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#D48624" stopOpacity="0" /><stop offset="0.22" stopColor="#F2A63C" stopOpacity="0.72" /><stop offset="0.55" stopColor="#F8C36A" stopOpacity="0.95" /><stop offset="1" stopColor="#D48624" stopOpacity="0" /></linearGradient>
          <filter id="qualityGlow" x="-10%" y="-45%" width="120%" height="190%"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <g className="quality-wave-layer quality-wave-layer--slow"><path d="M-80 195 C100 128 190 260 390 177 S650 90 820 163 S1100 255 1510 133" stroke="#D48624" strokeWidth="1.2" opacity="0.68" /><path d="M-50 236 C110 164 270 274 440 206 S680 116 880 194 S1160 275 1490 175" stroke="#F8C36A" strokeWidth=".8" strokeDasharray="2 13" opacity="0.55" /></g>
        <g className="quality-wave-layer quality-wave-layer--fast" filter="url(#qualityGlow)"><path className="quality-wave-stroke" d="M-40 206 C100 134 215 249 391 181 S625 92 814 166 S1098 262 1480 135" stroke="url(#qualityWave)" strokeWidth="2" /><path className="quality-wave-stroke quality-wave-stroke--fine" d="M-40 216 C110 153 255 263 431 198 S685 111 860 185 S1160 270 1480 158" stroke="#F8C36A" strokeWidth="1" strokeDasharray="11 10" opacity="0.82" /></g>
      </svg>
    </div>
  );
}
