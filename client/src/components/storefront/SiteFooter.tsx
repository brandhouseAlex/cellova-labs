/**
 * Visual style: quiet Ink footer that closes the experience as a research
 * register, with Paper wordmark contrast and technical navigation labels.
 */
import { Link } from "wouter";
import { CELLLOVA_ASSETS, CELLLOVA_SITE } from "@/lib/cellova";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-width site-footer__top">
        <div className="site-footer__brand">
          <img src={CELLLOVA_ASSETS.wordmark} alt="Cellova Labs" />
          <p>Research-use materials with clear specifications and organized documentation.</p>
        </div>
        <div className="site-footer__links">
          <div><p className="footer-label">EXPLORE</p><Link href="/catalog">Catalog</Link><Link href="/coa-library">COA Library</Link><Link href="/research-access">Research Access</Link></div>
          <div><p className="footer-label">POLICIES</p><Link href="/policies/terms">Terms</Link><Link href="/policies/privacy">Privacy</Link><Link href="/policies/disclosures">Research disclosure</Link></div>
          <div><p className="footer-label">CONTACT</p>{CELLLOVA_SITE.contactEmail ? <a href={`mailto:${CELLLOVA_SITE.contactEmail}`}>{CELLLOVA_SITE.contactEmail}</a> : <span>Contact details forthcoming</span>}<Link href="/account">Account</Link></div>
        </div>
      </div>
      <div className="site-width site-footer__bottom"><span>© {new Date().getFullYear()} Cellova Labs.</span><span>Clear. Precise. Measured.</span></div>
    </footer>
  );
}
