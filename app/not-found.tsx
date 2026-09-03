import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() { return <section className="section"><div className="container"><div className="surface mx-auto max-w-2xl px-7 py-16 text-center"><p className="eyebrow">Record not found</p><h1 className="font-display mt-3 text-3xl tracking-tight text-[color:var(--indigo)]">That product or collection is not available.</h1><p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[color:var(--muted)]">The record may have been removed or may not be available through the current catalog.</p><Link href="/shop" className="button-primary mt-7"> <ArrowLeft size={15} />Return to catalog</Link></div></div></section>; }
