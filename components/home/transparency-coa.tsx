import Image from "next/image";
import Link from "next/link";

const DOCUMENTATION_POINTS = [
  { label: "COA by lot", icon: "document" },
  { label: "Identity & purity testing", icon: "flask" },
  { label: "Endotoxin & heavy metals testing", icon: "shield" },
  { label: "Available when you need it", icon: "archive" },
] as const;

type DocumentationIconName = (typeof DOCUMENTATION_POINTS)[number]["icon"];

/**
 * Homepage documentation panel. The supplied COA remains the primary proof
 * visual; the surrounding papers and contour bands are structural only.
 */
export function TransparencyCoa() {
  return (
    <section
      className="bg-[#F7F7F4] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      aria-labelledby="transparency-heading"
    >
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[18px] bg-[#111B2F] px-6 py-9 text-paper shadow-[0_22px_46px_-34px_rgba(18,20,28,0.78)] sm:px-10 sm:py-12 lg:min-h-[474px] lg:px-14 lg:py-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          aria-hidden="true"
        >
          <span className="absolute -bottom-[54%] left-[29%] h-[145%] w-[70%] rounded-[50%] border-[82px] border-[#22304A]/75" />
          <span className="absolute -bottom-[60%] left-[42%] h-[155%] w-[73%] rounded-[50%] border-[60px] border-[#1B2840]/80" />
          <span className="absolute -right-[11%] -top-[35%] h-[100%] w-[68%] rounded-[48%] border-[72px] border-[#263653]/55" />
        </div>

        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,.87fr)_minmax(0,1.13fr)] lg:items-center lg:gap-12">
          <div className="max-w-[34rem]">
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.23em] text-[#C8CFDB]">
              <span className="h-3 w-3 rounded-full bg-[#F2A63C]" aria-hidden="true" />
              Documentation first
            </p>
            <h2
              id="transparency-heading"
              className="mt-5 font-display text-[2.25rem] font-semibold leading-[.98] tracking-[-0.045em] text-paper sm:text-5xl"
            >
              Complete Transparency.
              <span className="block text-[#F2A63C]">Every Lot.</span>
            </h2>
            <p className="mt-5 max-w-[31rem] text-[1rem] leading-7 text-[#C8CFDB] sm:text-[1.05rem]">
              Every lot is backed by third-party testing and organized documentation—because clarity is part of our standard.
            </p>

            <ul className="mt-7 grid gap-3" aria-label="Documentation standards">
              {DOCUMENTATION_POINTS.map((point) => (
                <li key={point.label} className="flex items-center gap-3 text-sm font-medium text-[#D8DEEA] sm:text-[0.97rem]">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[7px] bg-[#22304A] text-[#F2A63C]">
                    <DocumentationIcon name={point.icon} className="h-4.5 w-4.5" />
                  </span>
                  {point.label}
                </li>
              ))}
            </ul>

            <Link
              href="/coa-library"
              className="group mt-8 inline-flex min-h-12 items-center gap-4 rounded-[7px] bg-[#F2A63C] px-6 text-sm font-semibold text-[#12141C] shadow-[0_12px_24px_-16px_rgba(242,166,60,.85)] transition-colors hover:bg-[#F8BA55] active:scale-[0.98]"
            >
              View COA Library
              <span className="text-xl leading-none transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-[710px] lg:min-h-[380px]">
            <div className="pointer-events-none absolute left-[8%] top-[6%] h-[80%] w-[71%] rotate-[-8deg] rounded-[3px] bg-[#E9EDEF] shadow-[0_18px_32px_-20px_rgba(0,0,0,.72)]" aria-hidden="true" />
            <div className="pointer-events-none absolute left-[15%] top-[3%] h-[86%] w-[73%] rotate-[-3deg] rounded-[3px] bg-[#F8F9F8] shadow-[0_20px_34px_-22px_rgba(0,0,0,.8)]" aria-hidden="true" />
            <div className="relative ml-auto w-[94%] rotate-[2deg] overflow-hidden rounded-[4px] border border-[#DEE4EC] bg-white shadow-[0_26px_44px_-22px_rgba(0,0,0,.82)] lg:w-[88%]">
              <Image
                src="/brand/sermorelin-coa.png"
                alt="Sermorelin 10mg Certificate of Analysis from Bioviridian"
                width={715}
                height={466}
                priority
                sizes="(min-width: 1024px) 49vw, 92vw"
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DocumentationIcon({
  name,
  className,
}: {
  name: DocumentationIconName;
  className?: string;
}) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  if (name === "document") {
    return <svg {...common}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v5h4M10 13h5M10 17h5" /></svg>;
  }
  if (name === "flask") {
    return <svg {...common}><path d="M10 3h4M11 3v6l-5.1 8.2A2.4 2.4 0 0 0 8 21h8a2.4 2.4 0 0 0 2.1-3.8L13 9V3" /><path d="M8.5 15h7" /></svg>;
  }
  if (name === "shield") {
    return <svg {...common}><path d="M12 3 20 6v5c0 5.2-3.5 8.7-8 10-4.5-1.3-8-4.8-8-10V6l8-3Z" /><path d="m8.5 12 2.3 2.3 4.8-5" /></svg>;
  }
  return <svg {...common}><path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5z" /><path d="m4 8.5 8 4.5 8-4.5M12 13v7" /></svg>;
}
