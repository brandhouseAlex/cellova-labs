"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Ordering journey style: warm editorial guidance paired with a deliberately
 * empty charcoal visual stage that is ready for the user's future step assets.
 */
type JourneyStep = {
  number: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  image?: { src: string; alt: string };
};

const JOURNEY_STEPS: JourneyStep[] = [
  {
    number: "01",
    title: "Explore the Catalog",
    description: "Browse our complete selection of research compounds across vials, capsules, serums, and sprays.",
    cta: "Browse Catalog",
    href: "/products",
  },
  {
    number: "02",
    title: "Select Your Products",
    description: "Choose the formats, quantities, and strengths that fit your research needs. View specifications and COAs.",
    cta: "Explore Products",
    href: "/products",
  },
  {
    number: "03",
    title: "Order & Receive",
    description: "Secure checkout and reliable U.S.-based fulfillment—delivered with care and discretion.",
    cta: "Shipping Information",
    href: "/policies/shipping",
  },
];

function PlaceholderIcon() {
  return <svg viewBox="0 0 64 64" className="h-16 w-16 text-white/45" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="10" y="12" width="44" height="40" rx="5" /><circle cx="39" cy="26" r="5" /><path d="m15 46 13-14 9 9 6-6 6 11" /></svg>;
}

export function CatalogToDelivery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [entered, setEntered] = useState(false);
  const [manuallySelected, setManuallySelected] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setEntered(true);
      observer.disconnect();
    }, { threshold: 0.18 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!entered || manuallySelected || typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth < 1024) return;
    const stepTwo = window.setTimeout(() => setActiveIndex(1), 4500);
    const stepThree = window.setTimeout(() => setActiveIndex(2), 9000);
    return () => {
      window.clearTimeout(stepTwo);
      window.clearTimeout(stepThree);
    };
  }, [entered, manuallySelected]);

  const activeStep = JOURNEY_STEPS[activeIndex];

  function selectStep(index: number) {
    setManuallySelected(true);
    setActiveIndex(index);
  }

  return <section ref={sectionRef} className={`catalog-delivery bg-[#F3F4F1] py-20 sm:py-24 ${entered ? "catalog-delivery--entered" : ""}`} aria-labelledby="catalog-delivery-heading">
    <div className="home-page-container">
      <header className="catalog-delivery-intro grid gap-7 border-b border-[#dce1d9] pb-10 lg:grid-cols-[1.12fr_.88fr] lg:items-end lg:gap-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.19em] text-[#D48624]">Research Ordering</p>
          <h2 id="catalog-delivery-heading" className="mt-4 font-display text-4xl font-semibold leading-[1.01] tracking-[-0.05em] text-ink sm:text-5xl">From catalog to delivery,<br /><span className="text-[#5e922d]">in three steps.</span></h2>
        </div>
        <p className="max-w-md text-base leading-7 text-[#2D3452] lg:pb-1">A seamless experience from browsing our catalog to secure delivery. Built for researchers, engineered for reliability.</p>
      </header>

      <div className="catalog-delivery-shell mt-9 grid overflow-hidden rounded-[14px] border border-[#dfe3dc] bg-white lg:min-h-[610px] lg:grid-cols-[37%_63%]">
        <div className="catalog-delivery-steps relative bg-white py-2">
          <div className="catalog-delivery-progress pointer-events-none absolute bottom-[12%] left-[2.05rem] top-[12%] w-px bg-[#d7ddd2] sm:left-[2.45rem]" aria-hidden="true"><span className="catalog-delivery-progress-fill" style={{ height: `${activeIndex * 50}%` }} /></div>
          {JOURNEY_STEPS.map((step, index) => {
            const isActive = activeIndex === index;
            return <div key={step.number} className={`catalog-delivery-step relative z-10 grid grid-cols-[3.5rem_1fr] gap-3 px-4 py-5 transition-colors duration-300 sm:grid-cols-[4.2rem_1fr] sm:gap-5 sm:px-6 sm:py-7 ${isActive ? "catalog-delivery-step--active" : ""}`}>
              <button type="button" onMouseEnter={() => selectStep(index)} onFocus={() => selectStep(index)} onClick={() => selectStep(index)} className="catalog-delivery-step-button col-span-2 grid grid-cols-subgrid text-left outline-none" aria-pressed={isActive} aria-label={`Select step ${step.number}: ${step.title}`}>
                <span className="catalog-delivery-number z-10 flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold sm:h-11 sm:w-11">{step.number}</span>
                <span><span className="block text-[1.04rem] font-semibold leading-6 text-[#282a27] sm:text-lg">{step.title}</span><span className="mt-1.5 block max-w-[19rem] text-sm leading-6 text-[#5c605a]">{step.description}</span></span>
              </button>
              <div className="col-start-2 pt-0.5"><Link href={step.href} className="catalog-delivery-cta group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.09em] text-[#527f29] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#527f29]">{step.cta} <span className="transition-transform duration-200 group-hover:translate-x-[3px]" aria-hidden="true">→</span></Link></div>
            </div>;
          })}
        </div>

        <div className="catalog-delivery-visual relative flex min-h-[20rem] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#12141C,#12141C)] p-6 sm:p-8 lg:min-h-0">
          <div className="catalog-delivery-dashed flex min-h-[17rem] w-full items-center justify-center sm:min-h-[21rem] lg:min-h-[calc(610px-4rem)]">
            {activeStep.image ? <Image key={activeStep.number} src={activeStep.image.src} alt={activeStep.image.alt} fill className="catalog-delivery-future-image object-contain" sizes="(min-width: 1024px) 55vw, 100vw" /> : <div key={activeStep.number} className="catalog-delivery-placeholder flex max-w-xs flex-col items-center px-6 text-center"><PlaceholderIcon /><p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Visual Placeholder</p><p className="mt-3 text-sm leading-6 text-white/45">Interactive visual area will appear here.<br />Changes based on selected step.</p></div>}
          </div>
        </div>
      </div>
    </div>
  </section>;
}
