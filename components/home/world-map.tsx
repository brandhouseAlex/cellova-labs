/**
 * Minimal dotted world map used as a decorative backdrop for the
 * stats band. Pure SVG, no external assets.
 */
export function WorldMapDots({ className }: { className?: string }) {
  // Coarse continent dot fields on a 60x30 grid (x, y in grid units)
  const regions: Array<{ x: number; y: number; w: number; h: number }> = [
    // North America
    { x: 4, y: 6, w: 10, h: 6 },
    { x: 8, y: 12, w: 5, h: 3 },
    // South America
    { x: 12, y: 16, w: 5, h: 8 },
    // Europe
    { x: 27, y: 5, w: 7, h: 5 },
    // Africa
    { x: 28, y: 11, w: 8, h: 9 },
    // Asia
    { x: 36, y: 4, w: 14, h: 9 },
    { x: 42, y: 13, w: 6, h: 5 },
    // Oceania
    { x: 48, y: 19, w: 6, h: 4 },
  ];
  const dots: Array<{ cx: number; cy: number }> = [];
  for (const r of regions) {
    for (let gx = r.x; gx < r.x + r.w; gx++) {
      for (let gy = r.y; gy < r.y + r.h; gy++) {
        // pseudo-random thinning for organic coastlines
        if ((gx * 7 + gy * 13) % 5 < 3) {
          dots.push({ cx: gx * 10 + 5, cy: gy * 10 + 5 });
        }
      }
    }
  }

  // Highlighted "served" markers (approximate hub locations)
  const markers = [
    { cx: 95, cy: 85 }, // USA
    { cx: 305, cy: 65 }, // Western Europe
    { cx: 415, cy: 95 }, // South Asia
    { cx: 505, cy: 205 }, // Oceania
    { cx: 145, cy: 185 }, // South America
  ];

  return (
    <svg
      viewBox="0 0 600 300"
      className={className}
      role="img"
      aria-label="World map showing regions served"
    >
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={2.4} className="fill-line" />
      ))}
      {markers.map((m, i) => (
        <g key={`m-${i}`}>
          <circle cx={m.cx} cy={m.cy} r={10} className="fill-brand/15" />
          <circle cx={m.cx} cy={m.cy} r={4} className="fill-brand" />
        </g>
      ))}
    </svg>
  );
}
