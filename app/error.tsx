"use client";

import { RotateCw } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <section className="section"><div className="container"><div className="surface mx-auto max-w-2xl px-7 py-16 text-center"><p className="eyebrow">Temporary service issue</p><h1 className="font-display mt-3 text-3xl tracking-tight text-[color:var(--indigo)]">This information is temporarily unavailable.</h1><p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[color:var(--muted)]">Please retry shortly. No raw provider details are displayed.</p><button onClick={reset} className="button-primary mt-7"><RotateCw size={15} />Try again</button></div></div></section>; }
