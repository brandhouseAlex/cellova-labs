"use client";

import Link from "next/link";

/**
 * Account authentication is centralized at /access so Customer Account OAuth
 * and registration validation are never duplicated in a client component.
 */
export function AuthForms() {
  return (
    <div className="mx-auto max-w-md border border-line bg-white p-8 text-center">
      <p className="font-display text-xl font-semibold text-ink">Secure research access</p>
      <p className="mt-3 text-sm leading-6 text-slate">Cellova uses Shopify&apos;s email-code authentication for approved research accounts.</p>
      <Link href="/access" className="mt-6 inline-flex bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-paper hover:bg-brand-deep">Continue to secure access</Link>
    </div>
  );
}
