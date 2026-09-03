/**
 * Research-network gate visual: an SVG data field with transform-only CSS
 * movement. It uses no stock imagery or canvas work, keeps the DOM small, and
 * gracefully resolves to a static scientific signal for reduced-motion users.
 */
export function ResearchDataWave() {
  const paths = [
    "M-60 330 C100 255 180 410 325 300 S555 110 760 245 S970 398 1160 210",
    "M-50 385 C100 290 230 470 375 345 S565 188 730 285 S980 465 1160 285",
    "M-80 275 C82 205 205 330 350 245 S580 82 740 180 S990 350 1180 155",
    "M-40 445 C135 350 235 510 405 400 S620 250 800 355 S1000 520 1180 350",
  ];

  return (
    <div className="research-wave pointer-events-none absolute inset-x-0 bottom-0 top-20 overflow-hidden" aria-hidden="true">
      <svg viewBox="0 0 1120 610" preserveAspectRatio="none" className="h-full w-full" fill="none">
        <defs>
          <linearGradient id="gateWaveBright" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#D48624" stopOpacity="0" />
            <stop offset="0.34" stopColor="#F2A63C" stopOpacity="0.26" />
            <stop offset="0.64" stopColor="#F8C36A" stopOpacity="1" />
            <stop offset="1" stopColor="#F8C36A" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gateWaveSoft" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#D48624" stopOpacity="0" />
            <stop offset="0.48" stopColor="#F2A63C" stopOpacity="0.68" />
            <stop offset="1" stopColor="#F8C36A" stopOpacity="0" />
          </linearGradient>
          <filter id="gateGlow" x="-30%" y="-40%" width="160%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <pattern id="waveGrain" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="3" r="0.8" fill="#FFF1DB" opacity="0.42" />
            <circle cx="12" cy="11" r="0.6" fill="#F8C36A" opacity="0.28" />
            <circle cx="18" cy="6" r="0.4" fill="#F3F4F1" opacity="0.22" />
          </pattern>
        </defs>
        <g className="research-wave-layer research-wave-layer--far">
          {paths.map((path) => <path key={path} d={path} stroke="url(#gateWaveSoft)" strokeWidth="1.1" opacity="0.6" />)}
          {paths.map((path) => <path key={`dots-${path}`} d={path} className="research-wave-particles" stroke="url(#waveGrain)" strokeWidth="4.5" strokeDasharray="1 8" opacity="0.85" />)}
        </g>
        <g className="research-wave-layer research-wave-layer--near" filter="url(#gateGlow)">
          {paths.slice(0, 3).map((path) => <path key={`near-${path}`} d={path} className="research-wave-ribbon" stroke="url(#gateWaveBright)" strokeWidth="1.7" opacity="0.95" />)}
        </g>
        <g className="research-wave-layer research-wave-layer--glint">
          <path className="research-wave-glint-path" d="M-80 330 C120 260 205 407 365 290 S620 125 765 245 S990 405 1200 210" stroke="#FFF1DB" strokeWidth="1" strokeDasharray="2 17" opacity="0.78" />
        </g>
      </svg>
      <div className="research-wave-haze absolute bottom-[-18%] left-[14%] h-[46%] w-[80%] rounded-full bg-[#F2A63C]/15 blur-3xl" />
    </div>
  );
}
