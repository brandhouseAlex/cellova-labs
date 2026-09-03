"use client";

import { useEffect, useRef } from "react";

/**
 * Homepage hero style: three low-opacity Cellova silk ribbons morph independently.
 * This changes each SVG path's curvature and amplitude; it never moves the product
 * asset or the hero's HTML content. Reduced-motion users receive the initial still.
 */
const LAYER_CLASS = ["hero-silk-wave--back", "hero-silk-wave--middle", "hero-silk-wave--front"] as const;

function wavePath(layer: number, seconds: number) {
  const phase = seconds * [0.39, 0.54, 0.47][layer] + [0.2, 1.9, 3.6][layer];
  const motion = (offset: number, size: number) => Math.sin(phase + offset) * size + Math.sin(phase * 0.61 + offset * 1.7) * size * 0.42;
  const base = [584, 535, 626][layer];
  const crest = [96, 118, 87][layer];
  const dip = [82, 96, 79][layer];

  return [
    `M-180 ${base + motion(0.1, 25)}`,
    `C70 ${base - crest + motion(0.8, 34)} 238 ${base + dip + motion(2.2, 42)} 474 ${base - 30 + motion(3.8, 30)}`,
    `C676 ${base - 148 + motion(1.4, 50)} 773 ${base - 184 + motion(4.4, 48)} 988 ${base - 72 + motion(2.9, 41)}`,
    `C1196 ${base + 19 + motion(5.1, 42)} 1377 ${base + 118 + motion(0.4, 47)} 1780 ${base - 87 + motion(3.2, 35)}`,
    "V830H-180Z",
  ].join("");
}

export function HeroSilkWave() {
  const pathRefs = useRef<Array<SVGPathElement | null>>([]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (!preference.matches) return;

    let frame = 0;
    let lastPaint = 0;
    const animate = (now: number) => {
      if (now - lastPaint >= 32) {
        const seconds = now / 1000;
        pathRefs.current.forEach((path, index) => path?.setAttribute("d", wavePath(index, seconds)));
        lastPaint = now;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <svg viewBox="0 0 1600 800" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="hero-silk-back" x1="0" x2="1" y1="0.35" y2="0.7"><stop offset="0%" stopColor="#F2A63C" stopOpacity="0" /><stop offset="42%" stopColor="#F8C36A" stopOpacity="0.1" /><stop offset="74%" stopColor="#F2A63C" stopOpacity="0.2" /><stop offset="100%" stopColor="#F2A63C" stopOpacity="0" /></linearGradient>
        <linearGradient id="hero-silk-mid" x1="0" x2="1" y1="0.4" y2="0.55"><stop offset="0%" stopColor="#F2A63C" stopOpacity="0" /><stop offset="32%" stopColor="#a8cc89" stopOpacity="0.22" /><stop offset="66%" stopColor="#F2A63C" stopOpacity="0.18" /><stop offset="100%" stopColor="#FFF1DB" stopOpacity="0" /></linearGradient>
        <linearGradient id="hero-silk-front" x1="0" x2="1" y1="0.25" y2="0.8"><stop offset="0%" stopColor="#FFF1DB" stopOpacity="0" /><stop offset="36%" stopColor="#F2A63C" stopOpacity="0.12" /><stop offset="59%" stopColor="#a8cc89" stopOpacity="0.24" /><stop offset="100%" stopColor="#F2A63C" stopOpacity="0" /></linearGradient>
      </defs>
      {["hero-silk-back", "hero-silk-mid", "hero-silk-front"].map((gradient, index) => <g key={gradient} className={`hero-silk-wave ${LAYER_CLASS[index]}`}><path ref={(node) => { pathRefs.current[index] = node; }} d={wavePath(index, 0)} fill={`url(#${gradient})`} /></g>)}
    </svg>
  );
}
