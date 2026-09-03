"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Transparency style: a quiet charcoal laboratory dossier whose real supplied
 * COA is the focal proof point. The verification path repeats softly while in view.
 */
type StepIcon = "identity" | "purity" | "screened" | "released";

const STEPS: { number: string; title: string; description: string; icon: StepIcon }[] = [
  { number: "01", title: "Identity Confirmed", description: "Mass spectrometry confirms structure and molecular weight.", icon: "identity" },
  { number: "02", title: "Purity Verified", description: "HPLC analysis confirms ≥99% active compound.", icon: "purity" },
  { number: "03", title: "Contaminants Screened", description: "Endotoxin tested and heavy metals screened.", icon: "screened" },
  { number: "04", title: "Batch Released", description: "COA issued and archived for full traceability.", icon: "released" },
];

function TimelineIcon({ icon }: { icon: StepIcon }) {
  const shapes: Record<StepIcon, React.ReactNode> = {
    identity: <><circle cx="7" cy="7" r="2" /><circle cx="17" cy="6" r="2" /><circle cx="12" cy="17" r="2" /><path d="m8.7 8.2 2.4 7M15.2 7.4l-2.1 7.6M9 7.1l6 .7" /></>,
    purity: <><path d="M4 19V5M4 19h16" /><path d="m7 15 3-4 3 2 5-7" /><path d="M15 6h3v3" /></>,
    screened: <><path d="M12 3 20 6v5c0 5.2-3.5 8.7-8 10-4.5-1.3-8-4.8-8-10V6l8-3Z" /><path d="m8.5 12 2.3 2.3 4.8-5" /></>,
    released: <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v5h4M10 13h5M10 17h5" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true">{shapes[icon]}</svg>;
}

export function TransparencyCoa() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCount, setActiveCount] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [inView, setInView] = useState(false);
  const visibleStepCount = reduced ? STEPS.length : activeCount;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold: 0.35 });
    observer.observe(section);
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!inView || reduced) return;
    let delays: number[] = [];
    const runCycle = () => {
      setActiveCount(0);
      delays = [220, 980, 1740, 2500].map((delay, index) => window.setTimeout(() => setActiveCount(index + 1), delay));
    };
    runCycle();
    const interval = window.setInterval(runCycle, 6000);
    return () => {
      window.clearInterval(interval);
      delays.forEach((id) => window.clearTimeout(id));
    };
  }, [inView, reduced]);

  return <section ref={sectionRef} className={`home-transparency relative isolate overflow-hidden bg-ink py-12 text-white sm:py-12 ${visibleStepCount ? "home-transparency--active" : ""} ${reduced ? "home-transparency--reduced" : ""}`} aria-labelledby="transparency-heading">
    <div className="home-transparency-contours pointer-events-none absolute inset-0 opacity-55" aria-hidden="true"><svg viewBox="0 0 1440 900" preserveAspectRatio="none" className="h-full w-full fill-none"><path d="M-60 677c196-94 256 89 465-34s306-60 455 31 289 80 640-87" /><path d="M-120 735c199-94 267 108 481-24 209-129 301-54 457 38 146 86 285 64 669-108" /><path d="M-20 780c188-82 269 120 450 9 216-132 307-58 454 33 152 93 287 50 606-112" /></svg></div>
    <div className="home-page-container relative grid gap-10 lg:grid-cols-[.98fr_1.02fr_1fr] lg:items-center lg:gap-8">
      <div className="home-transparency-copy max-w-md">
        <p className="transparency-enter transparency-enter--1 text-xs font-semibold uppercase tracking-[0.19em] text-[#F8C36A]">Transparency you can trust.</p>
        <h2 id="transparency-heading" className="transparency-enter transparency-enter--2 mt-6 font-display text-[2.7rem] font-semibold leading-[1.02] tracking-[-0.052em] sm:text-5xl">True Quality.<br /><span className="text-[#F2A63C]">Full Transparency.</span></h2>
        <p className="transparency-enter transparency-enter--3 mt-5 text-[1.02rem] leading-7 text-white">We believe trust is earned through openness. Every batch is tested, verified, and documented—so you know exactly what you&apos;re working with. No guesswork. No shortcuts. Just uncompromising transparency.</p>
        <Link href="/coa-library" className="transparency-enter transparency-enter--4 group mt-10 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#F8C36A]">View Sample COA <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span></Link>
      </div>

      <div className="home-real-coa mx-auto w-full max-w-[23rem] lg:max-w-[25rem]"><Image src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663522951213/MajTRvncRPVLyVtJ.png" alt="Cellova Labs Certificate of Analysis sample document" width={1110} height={1304} priority unoptimized className="h-auto w-full object-contain" style={{ imageRendering: "auto" }} /></div>

      <div className="home-verification relative mx-auto w-full max-w-xl lg:pl-8">
        <div className="home-verification-line" aria-hidden="true"><span className="home-verification-signal" /></div>
        <ol className="space-y-6 sm:space-y-7">
          {STEPS.map((step, index) => {
            const active = visibleStepCount > index;
            return <li key={step.number} className={`home-verification-step relative grid grid-cols-[4.4rem_1fr] gap-5 sm:grid-cols-[5.1rem_1fr] sm:gap-7 ${active ? "home-verification-step--active" : ""}`}>
              <div className="relative z-10 flex items-center justify-center"><span className="home-verification-icon flex h-[4rem] w-[4rem] items-center justify-center rounded-full border sm:h-[4.5rem] sm:w-[4.5rem]"><TimelineIcon icon={step.icon} /></span></div>
              <div className="pt-1.5"><div className="flex items-center gap-4"><span className="font-display text-3xl font-medium leading-none tracking-[-0.04em] text-white/45 sm:text-4xl">{step.number}</span><span className="home-verification-rule h-px w-10 bg-[#F2A63C]/30 sm:w-12" /></div><h3 className="mt-2.5 text-lg font-semibold text-white/65 sm:text-xl">{step.title}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-white/55 sm:text-base">{step.description}</p></div>
            </li>;
          })}
        </ol>
      </div>
    </div>
  </section>;
}
