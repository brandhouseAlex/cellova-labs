/**
 * Visual style: crisp Ink navigation on a Paper surface, with Spark limited to
 * the active calibration line and primary commerce affordances.
 */
import { useState } from "react";
import { Link } from "wouter";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CELLLOVA_ASSETS } from "@/lib/cellova";

const navigation = [
  { href: "/products", label: "Products" },
  { href: "/collections", label: "Collections" },
  { href: "/coa-library", label: "COA Library" },
  { href: "/account", label: "Account" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { itemCount, openCart } = useCart();

  return (
    <>
      <div className="utility-bar">
        <div className="site-width utility-bar__inner">
          <span>Research-use catalog</span>
          <span className="utility-bar__note">Specifications and lot documentation are organized by product.</span>
        </div>
      </div>
      <header className="site-header">
        <div className="site-width site-header__inner">
          <Link href="/" className="brand-link" aria-label="Cellova Labs home">
            <img src={CELLLOVA_ASSETS.wordmark} alt="Cellova Labs" className="brand-wordmark" />
          </Link>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navigation.map(item => (
              <Link href={item.href} className="desktop-nav__link" key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button type="button" className="cart-trigger" onClick={openCart} aria-label={`Open cart with ${itemCount} items`}>
              <ShoppingBag size={18} strokeWidth={1.8} />
              <span>Cart</span>
              <b>{itemCount}</b>
            </button>
            <button type="button" className="mobile-menu-trigger" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen(value => !value)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {open && (
          <div className="mobile-nav" aria-label="Mobile primary navigation">
            {navigation.map(item => (
              <Link href={item.href} className="mobile-nav__link" key={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <button type="button" className="mobile-nav__cart" onClick={() => { setOpen(false); openCart(); }}>
              View cart <span>{itemCount}</span>
            </button>
          </div>
        )}
      </header>
    </>
  );
}
