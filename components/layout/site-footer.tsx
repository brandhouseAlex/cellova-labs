import Link from "next/link";
import Image from "next/image";

const SHOP_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/collections/vials", label: "Vials" },
  { href: "/collections/capsules", label: "Capsules" },
  { href: "/collections/serums", label: "Serums" },
  { href: "/collections/sprays", label: "Sprays" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/account", label: "Account" },
  { href: "/account/orders", label: "Order History" },
];

const POLICY_LINKS = [
  { href: "/policies/research-use", label: "Research Use Policy" },
  { href: "/policies/privacy", label: "Privacy Policy" },
  { href: "/policies/terms", label: "Terms of Use" },
  { href: "/policies/shipping", label: "Shipping Policy" },
  { href: "/policies/returns", label: "Returns Policy" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer border-t border-ink/10 bg-ink text-paper">
      <div className="home-page-container py-10 sm:py-14">
        <div className="grid grid-cols-2 gap-x-7 gap-y-8 sm:gap-x-10 sm:gap-y-10 lg:grid-cols-6">
          <div className="col-span-full lg:col-span-2">
            <Link
              href="/"
              aria-label="Cellova Labs — home"
              className="relative block h-12 w-[190px]"
            >
              <Image
                src="/brand/cellova-dark-wordmark.webp"
                alt="Cellova Labs"
                fill
                className="object-contain object-left"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-silver">
              High-purity research peptides, exosomes, and research compounds
              engineered for scientific discovery.
            </p>
          </div>

          <nav aria-label="Shop">
            <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-bright">
              Shop
            </h2>
            <ul className="mt-4 space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-silver transition-colors hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-bright">
              Company
            </h2>
            <ul className="mt-4 space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-silver transition-colors hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Policies">
            <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-bright">
              Policies
            </h2>
            <ul className="mt-4 space-y-2.5">
              {POLICY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-silver transition-colors hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-bright">
              Contact
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-silver">
              <li><a href="mailto:info@cellovalabs.com" className="transition-colors hover:text-paper">info@cellovalabs.com</a></li>
              <li>Mon – Fri: 9AM – 6PM EST</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-paper/10 pt-8">
          <div className="w-full space-y-3 text-sm leading-relaxed text-silver">
            <p><strong className="font-semibold text-paper">All products are sold for research, laboratory, or analytical purposes only, and are not for human or animal consumption.</strong></p>
            <p>Cellova Labs is a chemical supplier and is not a compounding pharmacy or chemical compounding facility as defined under 503A of the Federal Food, Drug, and Cosmetic Act. Cellova Labs is not an outsourcing facility as defined under 503B of the Federal Food, Drug, and Cosmetic Act.</p>
            <p>The statements made within this website have not been evaluated by the US Food and Drug Administration. The products we offer are not intended to diagnose, treat, cure, or prevent any disease.</p>
            <p>All articles and product information on this website are provided strictly for informational and educational purposes. The products offered are intended for laboratory research use only, specifically <em>in vitro</em> studies—experiments conducted outside of living organisms (Latin: <em>in glass</em>). These products are not approved by the FDA and are not intended to diagnose, treat, cure, or prevent any disease or medical condition. They are not for human or animal consumption or any form of bodily introduction, which is strictly prohibited by law.</p>
          </div>
        </div>

        {/* Bottom compliance bar — mirrors the announcement bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-paper/10 pt-6 sm:flex-row">
          <p className="text-xs text-silver">
            © {new Date().getFullYear()} Cellova Labs. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-medium uppercase tracking-[0.18em] text-silver">
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="h-3 w-3 text-brand-bright" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 3l7 3v5c0 4.4-3 8.4-7 10-4-1.6-7-5.6-7-10V6l7-3z" />
              </svg>
              Research Use Only
            </span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="h-3 w-3 text-brand-bright" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 3h6M10 3v6.3L4.7 18a2 2 0 0 0 1.8 3h11a2 2 0 0 0 1.8-3L14 9.3V3" />
              </svg>
              Not for Human Consumption
            </span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="h-3 w-3 text-brand-bright" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18" />
              </svg>
              U.S. Fulfillment
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
