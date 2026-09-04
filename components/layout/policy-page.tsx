import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

/** Clinical dossier shell for supplied policy text; content remains unchanged. */
export function PolicyPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-paper py-12 sm:py-16">
      <div className="grid-texture-light pointer-events-none absolute inset-0 opacity-55" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ name: "Policies", path: "/policies/research-use" }, { name: title, path: "" }]}
        />
        <header className="mt-8 border-b border-brand/30 pb-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="section-eyebrow">Cellova Labs</p>
            <span className="h-3 w-px bg-silver" aria-hidden="true" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate">Policy document</p>
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{title}</h1>
          {updated ? <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.1em] text-slate">Record updated: {updated}</p> : null}
        </header>
        <div className="mt-8 divide-y divide-line border-y border-line bg-paper/85 px-0 text-base leading-relaxed text-slate shadow-[0_18px_46px_-42px_rgba(32,32,32,0.4)] [&_section]:px-5 [&_section]:py-7 sm:[&_section]:px-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_h3]:mt-5 [&_h3]:font-mono [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:uppercase [&_h3]:tracking-[0.1em] [&_h3]:text-brand-deep [&_p+p]:mt-2 [&_strong]:text-ink [&_ul]:mt-4 [&_ul]:space-y-3 [&_ul]:pl-5 [&_ul]:marker:text-brand">
          {children}
        </div>
      </div>
    </div>
  );
}
