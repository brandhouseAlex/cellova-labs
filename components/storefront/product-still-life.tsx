export function ProductStillLife() {
  return <div aria-label="Cellova Labs product presentation" className="relative isolate min-h-[26rem] overflow-hidden rounded-[1.75rem] bg-[color:var(--indigo)] p-6 sm:min-h-[32rem] sm:p-10">
    <div className="absolute -left-16 top-8 h-64 w-64 rounded-full border border-[color:var(--spark)]/50" />
    <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[color:var(--spark)]/15 blur-2xl" />
    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent" />
    <p className="relative z-10 font-mono text-[0.63rem] uppercase tracking-[0.13em] text-[color:var(--spark)]">Product architecture / 01</p>
    <div className="absolute bottom-[-1rem] left-[15%] z-10 h-[19rem] w-[7.2rem] rounded-[1.25rem_1.25rem_0.75rem_0.75rem] border border-white/60 bg-[#f7f7f5] shadow-2xl sm:h-[24rem] sm:w-[8.6rem]">
      <i className="absolute -top-4 left-1/2 h-7 w-[5.2rem] -translate-x-1/2 rounded-[0.65rem] border border-white/70 bg-[#dfe2e8] shadow-md" />
      <div className="absolute inset-x-3 bottom-7 border-t-[3px] border-[color:var(--spark)] pt-3 text-center"><p className="font-display text-base tracking-tight text-[color:var(--indigo)]">Cellova</p><p className="mt-1 font-mono text-[0.52rem] tracking-[0.14em] text-[color:var(--slate)]">LABS / VIAL</p></div>
    </div>
    <div className="absolute bottom-[-1rem] right-[12%] z-20 h-[16rem] w-[6.5rem] rotate-[8deg] rounded-[1.2rem_1.2rem_0.65rem_0.65rem] border border-white/70 bg-[#f3f4f1] shadow-2xl sm:h-[20rem] sm:w-[7.5rem]"><i className="absolute -top-4 left-1/2 h-7 w-[4.8rem] -translate-x-1/2 rounded-[0.65rem] border border-white/70 bg-[#dfe2e8] shadow-md" /><div className="absolute inset-x-3 bottom-6 bg-[color:var(--indigo)] px-2 py-3 text-center"><p className="font-mono text-[0.48rem] tracking-[0.1em] text-white">RESEARCH</p></div></div>
    <div className="absolute right-8 top-[28%] h-[11rem] w-[11rem] rounded-full border border-white/15" />
  </div>;
}
