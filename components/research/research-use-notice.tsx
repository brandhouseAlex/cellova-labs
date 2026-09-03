import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * Reusable research-use disclaimer. Used on the homepage, product pages,
 * cart, checkout, footer, and the registration gate.
 */
export function ResearchUseNotice({
  variant = "default",
  className,
}: {
  variant?: "default" | "compact" | "prominent";
  className?: string;
}) {
  if (variant === "compact") {
    return (
      <p className={cn("text-xs leading-relaxed text-silver", className)}>
        All products are intended strictly for laboratory research purposes
        only and are not for human or animal consumption.
      </p>
    );
  }

  return (
    <div
      role="note"
      aria-label="Research use notice"
      className={cn(
        "rounded-[8px] border border-line bg-mist p-4 sm:p-5",
        variant === "prominent" && "border-brand/30 bg-brand-tint",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="mt-0.5 h-5 w-5 shrink-0 text-brand"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M9 3h6M10 3v6.3L4.7 18a2 2 0 0 0 1.8 3h11a2 2 0 0 0 1.8-3L14 9.3V3" />
        </svg>
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
            Research Use Only
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate">
            All products offered by Cellova Labs are intended strictly for
            laboratory research purposes only and are not for human or animal
            consumption. Products are not intended to diagnose, treat, cure,
            or prevent any disease.
          </p>
          <Link href="/policies/terms" className="mt-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-deep transition-colors hover:text-brand hover:underline">Read full terms <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </div>
  );
}
