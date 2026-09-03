"use client";

import { useEffect, useRef } from "react";

/**
 * Homepage restoration style: slow scientific orbital paths sit beneath the
 * stationary original product renders. Dot coordinates are updated directly so
 * each node follows a genuine ellipse and can stop for reduced-motion users.
 */
const ORBITS = [
  { cx: 450, cy: 350, rx: 315, ry: 190, duration: 14, phase: 0.2 },
  { cx: 450, cy: 350, rx: 276, ry: 164, duration: 19, phase: 2.4 },
  { cx: 450, cy: 350, rx: 338, ry: 211, duration: 23, phase: 4.8 },
] as const;

export function HeroOrbit() {
  const nodes = useRef<Array<SVGCircleElement | null>>([]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (!media.matches) return;
    let frame = 0;
    const moveNodes = (time: number) => {
      ORBITS.forEach((orbit, index) => {
        const theta = (time / 1000 / orbit.duration) * Math.PI * 2 + orbit.phase;
        nodes.current[index]?.setAttribute("cx", String(orbit.cx + Math.cos(theta) * orbit.rx));
        nodes.current[index]?.setAttribute("cy", String(orbit.cy + Math.sin(theta) * orbit.ry));
      });
      frame = requestAnimationFrame(moveNodes);
    };
    frame = requestAnimationFrame(moveNodes);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <svg viewBox="0 0 900 700" preserveAspectRatio="xMidYMid meet" className="home-orbit pointer-events-none absolute inset-0 z-10 h-full w-full" aria-hidden="true">
    <g className="home-orbit-drift">
      <ellipse cx="450" cy="350" rx="315" ry="190" fill="none" stroke="#5f812f" strokeOpacity="0.72" strokeWidth="1.2" transform="rotate(-42 450 350)" />
      <ellipse cx="450" cy="350" rx="276" ry="164" fill="none" stroke="#8B93A7" strokeOpacity="0.46" strokeWidth=".95" transform="rotate(-42 450 350)" />
      <ellipse cx="450" cy="350" rx="338" ry="211" fill="none" stroke="#b4ca9d" strokeOpacity="0.52" strokeWidth=".78" transform="rotate(-42 450 350)" />
      <circle cx="245" cy="478" r="6" fill="#628e2e" /><circle cx="655" cy="189" r="5" fill="#a7aaa5" /><circle cx="724" cy="407" r="4" fill="#d4e3c6" />
      {ORBITS.map((orbit, index) => <circle key={orbit.duration} ref={(element) => { nodes.current[index] = element; }} cx={orbit.cx + Math.cos(orbit.phase) * orbit.rx} cy={orbit.cy + Math.sin(orbit.phase) * orbit.ry} r={index === 0 ? 9 : index === 1 ? 6 : 4} fill={index === 0 ? "#F2A63C" : index === 1 ? "#9fa39e" : "#b4ca9d"} className="home-orbit-node" />)}
    </g>
  </svg>;
}
