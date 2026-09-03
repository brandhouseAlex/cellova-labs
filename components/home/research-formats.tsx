"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Research Formats style: one continuous warm editorial grid. The selector
 * controls real collection destinations and swaps only approved supplied
 * product images; Sprays is intentionally image-free until an asset is given.
 */
type FormatKey = "vials" | "capsules" | "serums" | "sprays";

type Format = {
  key: FormatKey;
  label: string;
  title: string;
  description: string;
  href: string;
  image?: { src: string; alt: string };
};

const FORMATS: Format[] = [
  {
    key: "vials",
    label: "Vials",
    title: "Vials",
    description: "Sterile, precision-filled vials. Standard 5 and 10mL vials with grey caps. Batch-specific COAs included.",
    href: "/collections/vials",
    image: { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663522951213/QyMAAuIDmmIjZeMl.png", alt: "Cellova Labs Melanotan 2 vial" },
  },
  {
    key: "capsules",
    label: "Capsules",
    title: "Capsules",
    description: "Precision-formulated capsules designed for consistency and reliable handling. Available across a growing range of research compounds and formulations.",
    href: "/collections/capsules",
    image: { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663522951213/CGXxlUPWLNpWtnzW.png", alt: "Cellova Labs Formula 2331 capsules" },
  },
  {
    key: "serums",
    label: "Serums",
    title: "Serums",
    description: "Precision-formulated research serums produced with carefully selected ingredients and consistent quality standards.",
    href: "/collections/serums",
    image: { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663522951213/fQNkDlplnhOlslbs.png", alt: "Cellova Labs GHK-Cu peptide serum" },
  },
  {
    key: "sprays",
    label: "Sprays",
    title: "Sprays",
    description: "Precision-formulated spray products designed for consistent dispensing and dependable research applications.",
    href: "/collections/sprays",
  },
];

const FORMAT_ICON_SPRITE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663522951213/rzZdLoyAYywglUVs.png";

const FORMAT_ICON_CROPS: Record<FormatKey, { className: string; position: string }> = {
  vials: { className: "h-[63px] w-[46px]", position: "-16px -14px" },
  capsules: { className: "h-[65px] w-[50px]", position: "-14px -108px" },
  serums: { className: "h-[65px] w-[39px]", position: "-22px -189px" },
  sprays: { className: "h-[72px] w-[47px]", position: "-18px -272px" },
};

/** Uses the user-supplied original icon artwork as a constrained sprite crop. */
function FormatIcon({ type }: { type: FormatKey }) {
  const crop = FORMAT_ICON_CROPS[type];
  return <span aria-hidden="true" className={`research-format-icon-sprite block shrink-0 ${crop.className}`} style={{ backgroundImage: `url(${FORMAT_ICON_SPRITE})`, backgroundPosition: crop.position }} />;
}

export function ResearchFormats() {
  const [activeKey, setActiveKey] = useState<FormatKey>("vials");
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  const active = FORMATS.find((format) => format.key === activeKey) ?? FORMATS[0];

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function selectFormat(nextKey: FormatKey) {
    if (nextKey === activeKey || leaving) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setActiveKey(nextKey);
      return;
    }
    setLeaving(true);
    timerRef.current = window.setTimeout(() => {
      setActiveKey(nextKey);
      setLeaving(false);
    }, 180);
  }

  return <section className="research-formats bg-[#F3F4F1]" aria-labelledby="research-formats-heading">
    <div className="home-page-container grid grid-cols-1 overflow-hidden border-r border-[#D8DCE3] lg:h-[33rem] lg:grid-cols-[1.18fr_.72fr_1.9fr]">
      <div className="research-format-intro flex flex-col justify-center border-b border-[#D8DCE3] px-6 py-12 sm:px-10 lg:border-b-0 lg:px-0 lg:pr-12">
        <p className="text-xs font-semibold uppercase tracking-[0.19em] text-[#D48624]">Research Formats</p>
        <h2 id="research-formats-heading" className="mt-5 font-display text-[2.55rem] font-semibold leading-[1.02] tracking-[-0.052em] text-ink sm:text-5xl">Multiple Formats.<br /><span className="text-[#F2A63C]">One Standard.</span></h2>
        <p className="mt-5 max-w-sm text-base leading-[1.6] text-slate sm:text-lg">Engineered for researchers. Backed by our uncompromising quality standard.</p>
        <Link href="/products" className="research-formats-explore group mt-8 inline-flex w-fit items-center gap-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#D48624]">Explore Formats <span className="research-formats-arrow text-xl leading-none" aria-hidden="true">→</span></Link>
      </div>

      <div className="grid grid-cols-2 border-b border-[#D8DCE3] sm:grid-cols-4 lg:grid-cols-1 lg:border-b-0 lg:border-l">
        {FORMATS.map((format) => {
          const isActive = format.key === activeKey;
          return <button key={format.key} type="button" onClick={() => selectFormat(format.key)} aria-pressed={isActive} className={`research-format-selector relative flex min-h-20 items-center gap-3 border-b border-r border-[#D8DCE3] px-5 py-4 text-left last:border-b-0 sm:border-r-0 sm:px-6 lg:min-h-0 lg:border-r-0 lg:px-7 ${isActive ? "research-format-selector--active" : ""}`}>
            <span className="research-format-icon"><FormatIcon type={format.key} /></span>
            <span className="text-sm font-semibold uppercase tracking-[0.04em] text-ink">{format.label}</span>
            <span className="research-format-arrow ml-auto text-2xl font-light text-[#D48624]" aria-hidden="true">›</span>
          </button>;
        })}
      </div>

      <div className={`research-format-visual relative min-h-[23rem] overflow-hidden border-t border-[#D8DCE3] bg-[radial-gradient(ellipse_at_65%_50%,#fff_0%,#ECEEF2_51%,#D8DCE3_100%)] sm:min-h-[28rem] lg:min-h-0 lg:border-l lg:border-t-0 ${leaving ? "research-format-visual--leaving" : ""}`} key={`visual-${active.key}`}>
        {active.image ? <Image src={active.image.src} alt={active.image.alt} fill unoptimized sizes="(min-width: 1024px) 52vw, 100vw" className="research-format-image object-cover object-center" /> : <div className="research-format-empty flex h-full items-center justify-center p-10 text-center"><div><span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#D48624]/20 bg-white/55 text-[#D48624]"><FormatIcon type="sprays" /></span><p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#626B82]">Spray collection</p></div></div>}
        <div className="research-format-overlay absolute left-0 top-0 z-10 max-w-md p-6 sm:p-8 lg:p-9">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D48624]">Research format</p>
          <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.045em] text-ink sm:text-4xl">{active.title}</h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#2D3452] sm:text-base">{active.description}</p>
          <Link href={active.href} className="research-format-learn group mt-5 inline-flex w-fit items-center gap-3 rounded-[4px] border border-[#D48624] bg-white/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#D48624] transition-colors duration-200 hover:border-[#D48624] hover:bg-[#FFF1DB]">Learn More <span className="research-formats-arrow text-lg leading-none" aria-hidden="true">→</span></Link>
        </div>
      </div>
    </div>
  </section>;
}
