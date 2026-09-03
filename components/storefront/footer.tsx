import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CellovaLogo } from "@/components/brand/cellova-logo";

const productLinks = [{ label: "Vials", href: "/collections/vials" }, { label: "Capsules", href: "/collections/capsules" }, { label: "Serums", href: "/collections/serums" }, { label: "Nasal Sprays", href: "/collections/nasal-sprays" }];
const resourceLinks = [{ label: "Shop All", href: "/shop" }, { label: "COA Library", href: "/coa-library" }, { label: "Account", href: "/account" }];

export function Footer() {
  return <footer className="bg-[color:var(--ink)] text-[color:var(--paper)]">
    <div className="container py-14 sm:py-16">
      <div className="grid gap-12 border-b border-white/15 pb-14 md:grid-cols-[1.45fr_0.75fr_0.75fr]">
        <div><div className="w-48"><CellovaLogo variant="light" /></div><p className="mt-6 max-w-sm text-sm leading-7 text-[#c4c7cf]">Clear specifications, organized documentation, and dependable research support.</p><Link href="/shop" className="mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--spark)]">View catalog <ArrowUpRight size={15} /></Link></div>
        <FooterColumn heading="Formats" links={productLinks} />
        <FooterColumn heading="Resources" links={resourceLinks} />
      </div>
      <div className="flex flex-col gap-3 pt-6 text-[0.62rem] font-medium uppercase tracking-[0.09em] text-[#a4a9b8] sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} Cellova Labs. Research use only.</span><span>Precision you can verify.</span></div>
    </div>
  </footer>;
}

function FooterColumn({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return <div><h2 className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-[color:var(--spark)]">{heading}</h2><ul className="mt-5 space-y-3">{links.map((link) => <li key={link.href}><Link className="text-sm text-[#d7d9de] transition-colors hover:text-[color:var(--spark)]" href={link.href}>{link.label}</Link></li>)}</ul></div>;
}
