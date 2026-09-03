import Link from "next/link";
import { ArrowUpRight, Droplets, Pill, SprayCan, TestTubeDiagonal } from "lucide-react";

const categories = [
  { title: "Vials", description: "Precise, documented formats.", href: "/collections/vials", icon: TestTubeDiagonal, number: "01" },
  { title: "Capsules", description: "A considered capsule collection.", href: "/collections/capsules", icon: Pill, number: "02" },
  { title: "Serums", description: "Measured topical formulations.", href: "/collections/serums", icon: Droplets, number: "03" },
  { title: "Nasal Sprays", description: "Dedicated spray formats.", href: "/collections/nasal-sprays", icon: SprayCan, number: "04" },
];

export function CategoryCards() {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{categories.map((category) => { const Icon = category.icon; return <Link key={category.href} href={category.href} className="group relative overflow-hidden rounded-2xl border border-[color:var(--line)] bg-white p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow)]"><span className="font-mono text-xs text-[color:var(--spark)]">{category.number}</span><Icon className="mt-9 text-[color:var(--indigo)] transition-transform duration-200 group-hover:scale-110" size={34} strokeWidth={1.3} /><h3 className="mt-7 font-display text-xl tracking-tight text-[color:var(--indigo)]">{category.title}</h3><p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{category.description}</p><span className="mt-6 flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[color:var(--ink)]">Explore <ArrowUpRight size={13} /></span><i className="absolute -right-6 -top-6 h-28 w-28 rounded-full border border-[color:var(--spark)]/40" /></Link>; })}</div>;
}
