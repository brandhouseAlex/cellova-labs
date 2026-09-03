"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { CellovaLogo } from "@/components/brand/cellova-logo";
import { useCart } from "@/components/storefront/cart-provider";

const navigation = [
  { label: "Vials", href: "/collections/vials" },
  { label: "Capsules", href: "/collections/capsules" },
  { label: "Serums", href: "/collections/serums" },
  { label: "Nasal Sprays", href: "/collections/nasal-sprays" },
  { label: "Shop All", href: "/shop" },
  { label: "COA Library", href: "/coa-library" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--line)] bg-[color:var(--paper)]/95 backdrop-blur-md">
      <div className="overflow-hidden bg-[color:var(--ink)] py-2 text-[0.63rem] font-medium uppercase tracking-[0.11em] text-[color:var(--paper)]">
        <div className="announcement-track flex w-max gap-12 whitespace-nowrap">
          {["Batch documentation", "Quality standards", "Clear specifications", "Research use only", "Batch documentation", "Quality standards", "Clear specifications", "Research use only"].map((message, index) => (
            <span key={`${message}-${index}`} className="flex items-center gap-3"><i className="h-1 w-1 rounded-full bg-[color:var(--spark)]" />{message}</span>
          ))}
        </div>
      </div>
      <div className="container flex h-[4.85rem] items-center justify-between gap-4">
        <Link href="/" aria-label="Cellova Labs home" className="block w-[9.25rem] shrink-0">
          <CellovaLogo priority />
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-5 xl:flex">
          {navigation.map((item) => <Link key={item.href} href={item.href} className="text-[0.71rem] font-semibold uppercase tracking-[0.035em] text-[color:var(--indigo)] transition-colors hover:text-[color:var(--spark)]">{item.label}</Link>)}
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/shop" aria-label="Search catalog" className="grid h-10 w-10 place-items-center rounded-full text-[color:var(--indigo)] transition-colors hover:bg-white"><Search size={19} strokeWidth={1.7} /></Link>
          <Link href="/account" aria-label="Customer account" className="grid h-10 w-10 place-items-center rounded-full text-[color:var(--indigo)] transition-colors hover:bg-white"><UserRound size={18} strokeWidth={1.7} /></Link>
          <button onClick={openCart} aria-label={`Cart, ${itemCount} items`} className="relative grid h-10 w-10 place-items-center rounded-full text-[color:var(--indigo)] transition-colors hover:bg-white"><ShoppingBag size={18} strokeWidth={1.7} />{itemCount > 0 && <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[color:var(--spark)] px-1 text-[0.56rem] font-bold text-[color:var(--ink)]">{itemCount}</span>}</button>
          <button aria-label="Open navigation menu" onClick={() => setMenuOpen(true)} className="grid h-10 w-10 place-items-center rounded-full text-[color:var(--indigo)] transition-colors hover:bg-white xl:hidden"><Menu size={21} strokeWidth={1.7} /></button>
        </div>
      </div>
      {menuOpen && <div className="fixed inset-0 z-[60] bg-[color:var(--ink)] text-[color:var(--paper)] xl:hidden">
        <div className="container flex h-[4.85rem] items-center justify-between">
          <div className="w-[9.25rem]"><CellovaLogo variant="light" /></div>
          <button onClick={() => setMenuOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-white/20"><X size={20} /></button>
        </div>
        <nav className="container flex flex-col gap-2 pt-14" aria-label="Mobile navigation">
          {navigation.map((item, index) => <Link onClick={() => setMenuOpen(false)} key={item.href} href={item.href} className="border-b border-white/10 py-5 font-display text-3xl tracking-tight transition-colors hover:text-[color:var(--spark)]"><span className="mr-4 font-mono text-xs text-[color:var(--spark)]">0{index + 1}</span>{item.label}</Link>)}
          <Link href="/account" onClick={() => setMenuOpen(false)} className="mt-6 text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--spark)]">Sign in or register</Link>
        </nav>
      </div>}
    </header>
  );
}
