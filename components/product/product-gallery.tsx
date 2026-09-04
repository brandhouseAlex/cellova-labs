"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { CommerceImage } from "@/lib/commerce/types";
import { cn } from "@/lib/utils";

/**
 * PDP style: static clinical image card. Product media remains provider-driven;
 * no decorative motion, orbit, particle, or wave competes with the live image.
 */
export function ProductGallery({
  title,
  images,
  hasCoa,
}: {
  title: string;
  images: CommerceImage[];
  hasCoa: boolean;
}) {
  const media = useMemo(() => images.filter((image, index, all) =>
    all.findIndex((candidate) => candidate.url === image.url) === index
  ), [images]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const selected = media[selectedIndex] ?? null;

  return (
    <div>
      <div className="relative aspect-[1.05/1] overflow-hidden rounded-[14px] border-2 border-ink-soft/75 bg-paper shadow-[0_18px_34px_-25px_rgba(45,52,82,0.42)]">
        {hasCoa ? <span className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-brand/10 bg-[#FFF1DB] px-3 py-1.5 text-[11px] font-semibold text-brand-deep shadow-sm backdrop-blur-sm"><VerifiedIcon className="h-3.5 w-3.5" />COA Verified</span> : null}
        {selected ? (
          <Image
            src={selected.url}
            alt={selected.altText || title}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="relative z-10 object-contain p-[6%]"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-sm text-silver">Product image unavailable</span>
        )}
        {selected ? (
          <button
            type="button"
            aria-label="Expand product image"
            onClick={() => setExpanded(true)}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper/90 text-ink shadow-sm backdrop-blur transition-all duration-200 hover:border-brand hover:text-brand-deep active:scale-95"
          >
            <ExpandIcon className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {media.length > 1 ? (
        <div className="mt-4 flex gap-3 overflow-x-auto px-1 pb-1" aria-label="Product image gallery">
          {media.map((image, index) => (
            <button
              key={image.url}
              type="button"
              aria-label={`Show image ${index + 1} of ${media.length}`}
              aria-pressed={selectedIndex === index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-[8px] border bg-paper transition-all duration-200 sm:h-24 sm:w-24",
                selectedIndex === index ? "border-brand ring-2 ring-brand/15" : "border-line hover:border-brand/50"
              )}
            >
              <Image src={image.url} alt="" fill sizes="96px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      ) : null}

      {expanded && selected ? (
        <div role="dialog" aria-modal="true" aria-label={`${title} enlarged image`} className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-5 backdrop-blur-sm" onClick={() => setExpanded(false)}>
          <div className="relative h-full max-h-[90vh] w-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
            <Image src={selected.url} alt={selected.altText || title} fill sizes="90vw" className="object-contain" />
            <button type="button" onClick={() => setExpanded(false)} className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink shadow-lg hover:bg-brand-tint" aria-label="Close enlarged image">×</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ExpandIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M8 4H4v4M16 4h4v4M20 16v4h-4M4 16v4h4" /><path d="m9 9-5-5m11 5 5-5m-5 11 5 5M9 15l-5 5" /></svg>;
}

function VerifiedIcon({ className }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M12 3 19 6v5c0 4.4-3 8.4-7 10-4-1.6-7-5.6-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" /></svg>; }
