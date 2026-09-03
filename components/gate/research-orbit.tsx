/**
 * Decorative CSS/SVG orbital field for the Cellova access gate. It is rendered
 * as structured markup—not an image—so reduced-motion users receive the same
 * composition without continuous animation.
 */
export function ResearchOrbit() {
  const orbits = [
    { ring: "gate-orbit--outer", dot: "gate-orbit-node--amber" },
    { ring: "gate-orbit--one", dot: "gate-orbit-node--paper" },
    { ring: "gate-orbit--two", dot: "gate-orbit-node--amber" },
    { ring: "gate-orbit--three", dot: "gate-orbit-node--slate" },
    { ring: "gate-orbit--four", dot: "gate-orbit-node--paper" },
    { ring: "gate-orbit--inner", dot: "gate-orbit-node--amber" },
  ];

  return (
    <div className="gate-orbit-field pointer-events-none" aria-hidden="true">
      <div className="gate-orbit-core"><span /></div>
      {orbits.map(({ ring, dot }) => (
        <div key={ring} className={`gate-orbit ${ring}`}>
          <span className={`gate-orbit-node ${dot}`} />
        </div>
      ))}
    </div>
  );
}
