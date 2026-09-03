"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/lib/auth/cart-store";
import { useAuth } from "@/lib/auth/auth-store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/collections/vials", label: "Vials" },
  { href: "/collections/capsules", label: "Capsules" },
  { href: "/collections/serums", label: "Serums" },
  { href: "/products", label: "Shop All" },
  { href: "/coa-library", label: "COA Library" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, openDrawer } = useCart();
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close overlays on route change (render-time adjustment pattern)
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const q = searchTerm.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setSearchOpen(false);
    setSearchTerm("");
  }

  const itemCount = cart?.totalQuantity ?? 0;

  return (
    <>
      {/* Premium announcement: four identical copies allow the track to loop without a visible gap. */}
      <div className="home-announcement bg-[#12141C] text-[#F3F4F1]" role="region" aria-label="Store announcement">
        <span className="sr-only">Free shipping on orders $150 or more. Save 10 percent with code CELLOVA10 at checkout. USA-based fulfillment. Research use only.</span>
        <div className="announcement-viewport" aria-hidden="true">
          <div className="announcement-track">
            {Array.from({ length: 4 }, (_, index) => <span key={index} className="announcement-message"><span>Free Shipping on Orders $150+</span><b>•</b><span>Save 10% with Code <strong className="announcement-coupon">CELLOVA10</strong> at Checkout</span><b>•</b><span>USA-Based Fulfillment</span><b>•</b><span>Research Use Only</span><b>•</b></span>)}
          </div>
        </div>
      </div>
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12 xl:px-16">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Cellova Labs — home"
          className="relative block h-10 w-[97px] shrink-0 sm:h-11 sm:w-[106px]"
        >
          <Image
            src="/brand/cellova-wordmark.webp"
            alt="Cellova Labs"
            fill
            priority
            className="object-contain object-left"
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "text-sm font-medium tracking-wide transition-colors hover:text-brand",
                      active ? "text-brand" : "text-ink"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label="Search products"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
            className="p-2 text-ink transition-colors hover:text-brand"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>

          <Link
            href="/account"
            aria-label={isAuthenticated ? "Account dashboard" : "Sign in"}
            className="p-2 text-ink transition-colors hover:text-brand"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
            </svg>
          </Link>

          <button
            type="button"
            aria-label={`Open cart, ${itemCount} items`}
            onClick={openDrawer}
            className="relative p-2 text-ink transition-colors hover:text-brand"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M6 7h12l1.5 13.5a1 1 0 0 1-1 1.1H5.5a1 1 0 0 1-1-1.1L6 7Z" />
              <path d="M9 10V6a3 3 0 0 1 6 0v4" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-paper">
                {itemCount}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 text-ink transition-colors hover:text-brand lg:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Expanding search bar */}
      {searchOpen && (
        <div className="border-t border-line bg-paper">
          <form
            role="search"
            onSubmit={submitSearch}
            className="mx-auto flex max-w-[1440px] items-center gap-3 px-5 py-3 sm:px-8 lg:px-12 xl:px-16"
          >
            <label htmlFor="site-search" className="sr-only">
              Search the research catalog
            </label>
            <input
              ref={searchInputRef}
              id="site-search"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search the research catalog…"
              className="w-full border border-line bg-mist px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 bg-ink px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-paper transition-colors hover:bg-brand-deep"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile nav */}
      {mobileOpen && (
        <nav
          aria-label="Mobile"
          className="border-t border-line bg-paper lg:hidden"
        >
          <ul className="mx-auto max-w-[1440px] px-5 py-4 sm:px-8 lg:px-12 xl:px-16">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block border-b border-line py-3 text-base font-medium last:border-0",
                      active ? "text-brand" : "text-ink"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
    </>
  );
}
