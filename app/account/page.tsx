import type { Metadata } from "next";
import { AccountPanel } from "@/components/storefront/account-panel";

export const metadata: Metadata = { title: "Customer Account", description: "Sign in or register for Cellova Labs catalog access.", robots: { index: false, follow: false } };
export default function AccountPage() { return <section className="section"><div className="container"><div className="mx-auto max-w-2xl text-center"><p className="eyebrow">Customer access</p><h1 className="font-display mt-3 text-4xl tracking-[-0.045em] text-[color:var(--indigo)]">An account backed by<br />your customer record.</h1><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[color:var(--muted)]">Catalog access, registration information, and consent are handled through the selected commerce customer provider rather than browser-only flags.</p></div><div className="mt-10"><AccountPanel /></div></div></section>; }
