import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------- Badge ------------------------------- */

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "outline";
  className?: string;
}) {
  const tones = {
    neutral: "bg-fog text-slate",
    brand: "bg-brand-tint text-brand-deep",
    outline: "border border-line text-slate",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/* --------------------------- Research marker -------------------------- */

export function ResearchUseBadge({ className }: { className?: string }) {
  return (
    <Badge tone="brand" className={className}>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9 3h6M10 3v6.3L4.7 18a2 2 0 0 0 1.8 3h11a2 2 0 0 0 1.8-3L14 9.3V3" />
      </svg>
      Research Use Only
    </Badge>
  );
}

/* ------------------------------- Inputs ------------------------------- */

export function Field({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium uppercase tracking-[0.14em] text-slate"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-silver">{hint}</p> : null}
    </div>
  );
}

const inputStyles =
  "w-full border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-silver transition-colors focus:border-brand focus:outline-none";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputStyles} {...props} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputStyles, "min-h-32")} {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(inputStyles, "appearance-none pr-10")} {...props} />
  );
}

/* --------------------------- Section heading -------------------------- */

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 text-xs font-semibold uppercase tracking-[0.28em]",
            dark ? "text-brand-bright" : "text-brand"
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-display text-3xl font-semibold tracking-tight sm:text-4xl",
          dark ? "text-paper" : "text-ink"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            dark ? "text-silver" : "text-slate"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
