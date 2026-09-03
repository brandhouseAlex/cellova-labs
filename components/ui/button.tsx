import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "brand";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[6px] font-medium tracking-wide transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97]";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-brand-deep hover:shadow-[0_10px_24px_-10px_rgba(78,125,41,0.55)]",
  secondary:
    "border border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper",
  ghost: "text-ink hover:bg-fog",
  inverse: "bg-paper text-ink hover:bg-brand-bright hover:text-ink",
  brand:
    "bg-brand text-paper hover:bg-brand-deep hover:shadow-[0_10px_24px_-10px_rgba(78,125,41,0.55)]",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs uppercase",
  md: "px-6 py-3 text-sm uppercase",
  lg: "px-8 py-4 text-sm uppercase",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </Link>
  );
}
