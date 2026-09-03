import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center sm:px-6">
      <p className="font-mono text-sm text-brand">404</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink">
        Page Not Found
      </h1>
      <p className="mt-4 text-base leading-relaxed text-slate">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="bg-ink px-8 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-brand-deep"
        >
          Return Home
        </Link>
        <Link
          href="/products"
          className="border border-ink/20 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink"
        >
          Browse Catalog
        </Link>
      </div>
    </div>
  );
}
