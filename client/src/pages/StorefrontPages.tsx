/**
 * Visual style: Cellova’s Warm Laboratory Editorial system, using generous
 * Paper space, Indigo structure, monospace technical data, and measured Spark.
 */
import { FormEvent, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowRight, Check, ChevronRight, FileText, FlaskConical, Headphones, LoaderCircle, LogIn, PackageCheck, Search, ShieldCheck, Truck, UserPlus } from "lucide-react";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { PurchasePanel } from "@/components/storefront/PurchasePanel";
import { ProductInformationTabs } from "@/components/storefront/ProductInformationTabs";
import { trpc } from "@/lib/trpc";
import { CELLLOVA_ASSETS, CELLLOVA_SITE, formatMoney, usePageMeta } from "@/lib/cellova";
import { useCart } from "@/contexts/CartContext";

const features = [
  ["01", "Clear specifications", "Core product information is presented in a quick, comparable format."],
  ["02", "Lot documentation", "Documentation is organized alongside the product record when made available."],
  ["03", "Research-focused support", "An access workflow keeps the catalog tailored to research use."],
];

export function HomePage() {
  usePageMeta("Precision You Can Verify", CELLLOVA_SITE.description);
  return (
    <>
      <main>
        <section className="hero-section">
          <div className="site-width hero-section__grid">
            <div className="hero-copy enter-stagger">
              <p className="eyebrow eyebrow--spark">CELLOVA LABS / RESEARCH CATALOG</p>
              <h1>Precision you<br /><em>can verify.</em></h1>
              <p className="hero-copy__body">Clear specifications, organized documentation, and a disciplined route to the research materials you need.</p>
              <div className="hero-copy__actions"><Link href="/catalog" className="button button--spark">View catalog <ArrowRight size={17} /></Link><Link href="/coa-library" className="button button--ink">Documentation</Link></div>
            </div>
            <div className="hero-image-field"><img src={CELLLOVA_ASSETS.hero} alt="Clear laboratory vials arranged on a warm studio surface" /><div className="hero-image-field__index"><span>01</span><span>RESEARCH MATERIALS</span></div></div>
          </div>
        </section>

        <section className="site-width introduction-section">
          <div className="introduction-section__label"><span className="calibration-line" />INFORMATION BEFORE IMPRESSION</div>
          <div><p className="eyebrow eyebrow--spark">BUILT FOR CLEAR DECISIONS</p><h2>Every product record is designed to be read, not decoded.</h2></div>
          <p className="introduction-section__copy">Cellova Labs brings a calmer structure to the research catalog. Product identity, key specifications, availability, and lot documentation retain distinct roles—so the information remains useful at a glance.</p>
        </section>

        <ProductGrid title="The current catalog" description="Explore independently published Cellova Labs products and their available documentation." className="site-width" />

        <section className="process-section">
          <div className="site-width process-section__grid">
            <div className="process-section__image"><img src={CELLLOVA_ASSETS.documentation} alt="Laboratory vial, technical paper, and precision caliper on a dark desk" /></div>
            <div className="process-section__content"><p className="eyebrow eyebrow--spark">A DISCIPLINED PATH</p><h2>Built around the product record.</h2><p>From the catalog to checkout, Cellova prioritizes the exact information that informs a research purchase. Documentation remains visible and connected to its product when supplied.</p><Link href="/research-access" className="text-link">Review research access <ArrowRight size={16} /></Link></div>
          </div>
        </section>

        <section className="site-width feature-section">
          <p className="eyebrow eyebrow--spark">THE CELLOVA SYSTEM</p><div className="feature-section__header"><h2>Clear, precise, measured.</h2><p>Design follows the record: every component exists to make the catalog and its documentation easier to navigate.</p></div><div className="feature-grid">{features.map(([number, title, description]) => <article key={number} className="feature-card"><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
        </section>

        <section className="catalog-callout"><div className="site-width catalog-callout__grid"><div><p className="eyebrow eyebrow--spark">START WITH THE RECORD</p><h2>Research materials, presented with restraint.</h2></div><Link href="/catalog" className="button button--spark">Browse the catalog <ArrowRight size={17} /></Link></div></section>
      </main>
    </>
  );
}

export function CatalogPage() {
  usePageMeta("Research Catalog", "Browse the independent Cellova Labs research-use catalog.");
  return <main className="page-main"><section className="catalog-header"><div className="site-width"><p className="eyebrow eyebrow--spark">RESEARCH CATALOG</p><h1>Materials with a<br /><em>clear record.</em></h1><p>Review published Cellova Labs products, then follow each record through to its available product and lot information.</p></div></section><ProductGrid className="site-width page-grid" /></main>;
}

export function ProductDetailPage() {
  const [, catalogParams] = useRoute<{ handle: string }>("/catalog/:handle");
  const [, productParams] = useRoute<{ handle: string }>("/products/:handle");
  const handle = catalogParams?.handle ?? productParams?.handle ?? "";
  const productQuery = trpc.commerce.products.byHandle.useQuery({ handle }, { enabled: Boolean(handle) });
  const relatedQuery = trpc.commerce.products.list.useQuery({ first: 8 });
  const product = productQuery.data;
  usePageMeta(product?.title || "Catalog Record", product?.description || "Cellova Labs product record.");
  if (productQuery.isLoading) return <main className="page-main"><div className="site-width loading-page"><LoaderCircle className="spin" size={28} /> Loading product record…</div></main>;
  if (!product) return <main className="page-main"><div className="site-width not-found-panel"><p className="eyebrow">CATALOG RECORD</p><h1>This product record is unavailable.</h1><Link href="/catalog" className="button button--ink">Back to catalog</Link></div></main>;
  const image = product.images[0];
  const related = (relatedQuery.data ?? []).filter(item => item.id !== product.id).slice(0, 4);
  return (
    <main className="page-main product-detail-page">
      <div className="site-width breadcrumb"><Link href="/catalog">Catalog</Link><ChevronRight size={14} /><span>{product.title}</span></div>
      <section className="site-width product-detail">
        <div className="product-detail__gallery"><div className="product-detail__image"><img src={image?.url || CELLLOVA_ASSETS.product} alt={image?.altText || `${product.title} product presentation`} /></div>{product.images.length > 1 && <div className="product-detail__thumbnails">{product.images.map((photo, index) => <img key={photo.url} src={photo.url} alt={photo.altText || `${product.title} visual ${index + 1}`} />)}</div>}</div>
        <div className="product-detail__record">
          <div className="product-detail__badges"><span>{product.productType || "RESEARCH MATERIAL"}</span><span>RESEARCH USE ONLY</span></div>
          <h1>{product.title}</h1>
          <p className="product-detail__description">{product.description || "Product details and research documentation will be maintained in the Cellova Labs catalog."}</p>
          <div className="specification-box"><p className="eyebrow eyebrow--spark">SPECIFICATIONS</p><dl><div><dt>Product class</dt><dd>{product.productType || "Research material"}</dd></div><div><dt>Formats</dt><dd>{product.variants.length ? `${product.variants.length} available` : "Pending"}</dd></div><div><dt>Catalog status</dt><dd>{product.variants.some(item => item.availableForSale) ? "Available" : "Availability pending"}</dd></div><div><dt>Lot records</dt><dd>{product.lotDocumentations.length ? `${product.lotDocumentations.length} published` : "Published when configured"}</dd></div></dl></div>
          <div className="quality-badges"><span><ShieldCheck size={20} /><b>Quality standards</b><small>Product record maintained</small></span><span><Check size={20} /><b>Documentation-led</b><small>Identity and lot details</small></span><span><FlaskConical size={20} /><b>Research catalog</b><small>For authorized use</small></span></div>
          <PurchasePanel product={product} />
          <div className="product-assurance"><span><Truck size={20} />Research-order fulfillment</span><span><FlaskConical size={20} />Research-use handling</span><span><PackageCheck size={20} />Secure packaging</span></div>
        </div>
      </section>
      <section className="site-width"><ProductInformationTabs product={product} /></section>
      <section className="site-width product-service-grid"><article><Truck size={28} /><h3>Order handling</h3><p>Review current fulfillment details before completing a research order.</p></article><article><PackageCheck size={28} /><h3>Delivery records</h3><p>Product and documentation records stay connected through the catalog.</p></article><article><FlaskConical size={28} /><h3>Standards matter</h3><p>Use product documentation to support your research workflow.</p></article><article><Headphones size={28} /><h3>Research support</h3><p>Contact Cellova for catalog and documentation questions.</p></article></section>
      {related.length > 0 && <section className="site-width related-products"><p className="eyebrow eyebrow--spark">CONTINUE EXPLORING</p><h2>You may also research</h2><div className="related-products__grid">{related.map(item => <Link key={item.id} href={`/catalog/${item.handle}`}><img src={item.images[0]?.url || CELLLOVA_ASSETS.product} alt="" /><span>{item.productType || "RESEARCH MATERIAL"}</span><strong>{item.title}</strong><small>{formatMoney(item.priceRange.min.amount, item.priceRange.min.currencyCode)}</small></Link>)}</div></section>}
    </main>
  );
}

export function CoaLibraryPage() {
  usePageMeta("COA Library", "Find available Cellova Labs lot documentation by product.");
  const productsQuery = trpc.commerce.products.list.useQuery({ first: 50 });
  const [query, setQuery] = useState("");
  const available = (productsQuery.data ?? []).filter(product => product.lotDocumentation);
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = available.filter(product => product.title.toLowerCase().includes(normalizedQuery) || product.lotDocumentation?.lotNumber.toLowerCase().includes(normalizedQuery));
  return <main className="page-main coa-page"><section className="coa-hero"><div className="site-width"><p className="eyebrow eyebrow--spark">COA LIBRARY</p><h1>Documentation,<br /><em>organized by lot.</em></h1><p>When made available, certificates of analysis are linked directly to Cellova Labs product records and their configured lot details.</p></div></section><section className="site-width coa-content"><div className="coa-search"><Search size={18} /><input aria-label="Search COA library" placeholder="Search a product or lot number" value={query} onChange={event => setQuery(event.target.value)} /><span>Catalog-connected records will appear here.</span></div>{productsQuery.isLoading ? <div className="loading-page"><LoaderCircle className="spin" size={28} /> Loading documentation…</div> : filtered.length ? <div className="coa-table">{filtered.map(product => { const lot = product.lotDocumentation!; return <article key={product.id} className="coa-row"><span className="product-tech">PRODUCT RECORD</span><Link href={`/catalog/${product.handle}`}><strong>{product.title}</strong></Link><span>Lot {lot.lotNumber} · Tested {lot.testedDate}</span><a href={lot.pdfUrl} target="_blank" rel="noreferrer" className="coa-pdf-link">View PDF <FileText size={15} /></a></article>; })}</div> : <div className="empty-catalog coa-empty"><FileText size={28} /><p className="eyebrow">DOCUMENTATION STATUS</p><h3>{available.length ? "No published COA records match that search." : "COA records will appear as the independent catalog is configured."}</h3><p>Only complete, approved Cellova lot records with a source PDF appear here.</p></div>}</section></main>;
}

export function ResearchAccessPage() {
  usePageMeta("Research Access", "Apply for research catalog access with Cellova Labs.");
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); };
  return <main className="page-main research-page"><section className="site-width research-page__grid"><div><p className="eyebrow eyebrow--spark">RESEARCH ACCESS</p><h1>A catalog built for a clear research context.</h1><p>Cellova Labs uses access information to support a relevant research-use experience. Final customer-account submission should be connected to the independent Cellova Shopify customer setup before production use.</p><div className="research-benefits"><p><Check size={17} />Research-focused catalog access</p><p><Check size={17} />Product and documentation visibility</p><p><Check size={17} />Controlled, separate customer records</p></div></div><div className="access-form-panel">{submitted ? <div className="form-confirmation"><ShieldCheck size={34} /><p className="eyebrow eyebrow--spark">FORM CAPTURE PAUSED</p><h2>Your research-access workflow is ready for Cellova-specific customer credentials.</h2><p>No registration data was sent from this preview. Connect the new Cellova customer-account API before accepting production applications.</p><button className="button button--ink" onClick={() => setSubmitted(false)}>Review form</button></div> : <form onSubmit={submit}><p className="product-tech">RESEARCHER PROFILE</p><h2>Request catalog access.</h2><div className="form-split"><label>First name<input required name="firstName" autoComplete="given-name" /></label><label>Last name<input required name="lastName" autoComplete="family-name" /></label></div><label>Email<input required type="email" name="email" autoComplete="email" /></label><label>Phone<input required type="tel" name="phone" autoComplete="tel" /></label><label>Company or affiliation<input required name="company" /></label><div className="form-split"><label>State<input required name="state" autoComplete="address-level1" /></label><label>Intended use<select name="intendedUse" required defaultValue=""><option value="" disabled>Select one</option><option value="academic">Academic research</option><option value="laboratory">Laboratory research</option><option value="commercial">Commercial research</option><option value="other">Other research use</option></select></label></div><label className="consent"><input type="checkbox" required /><span>I confirm this request is for lawful research use and accept the Cellova Labs research disclosure.</span></label><button className="button button--spark button--wide" type="submit">Continue to customer setup <ArrowRight size={16} /></button></form>}</div></section></main>;
}

export function AccessPortalPage() {
  usePageMeta("Customer Access", "Cellova Labs customer login and registration access.");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); };
  const switchMode = (nextMode: "login" | "register") => { setMode(nextMode); setSubmitted(false); };

  return <main className="page-main access-portal"><section className="site-width access-portal__grid"><div className="access-portal__intro"><p className="eyebrow eyebrow--spark">CELLOVA CUSTOMER ACCESS</p><h1>Account access will remain separate by design.</h1><p>Customer identities, access review, and order records will be created only in the independent Cellova Labs customer environment. This preview does not transmit the fields below.</p><div className="access-portal__notes"><p><Check size={16} />No legacy customer records are used.</p><p><Check size={16} />Research access remains connected to the Cellova catalog.</p><p><Check size={16} />Production credentials are configured separately.</p></div><Link href="/research-access" className="text-link">Review research-access requirements <ArrowRight size={16} /></Link></div><div className="access-card"><div className="access-card__tabs"><button type="button" className={mode === "login" ? "is-active" : ""} onClick={() => switchMode("login")} aria-pressed={mode === "login"}><LogIn size={16} />Sign in</button><button type="button" className={mode === "register" ? "is-active" : ""} onClick={() => switchMode("register")} aria-pressed={mode === "register"}><UserPlus size={16} />Register</button></div>{submitted ? <div className="form-confirmation"><ShieldCheck size={34} /><p className="eyebrow eyebrow--spark">PREVIEW MODE</p><h2>{mode === "login" ? "Customer sign-in is ready to connect." : "Customer registration is ready to connect."}</h2><p>No data was submitted. Complete the Cellova-only Shopify customer-account configuration before enabling this form in production.</p><button className="button button--ink" onClick={() => setSubmitted(false)}>Return to form</button></div> : <form onSubmit={submit}><p className="product-tech">{mode === "login" ? "EXISTING CUSTOMER" : "NEW CUSTOMER"}</p><h2>{mode === "login" ? "Sign in to Cellova." : "Register for Cellova access."}</h2>{mode === "register" && <div className="form-split"><label>First name<input required autoComplete="given-name" /></label><label>Last name<input required autoComplete="family-name" /></label></div>}<label>Email<input required type="email" autoComplete="email" /></label><label>Password<input required type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} /></label>{mode === "register" && <label className="consent"><input type="checkbox" required /><span>I agree to the Cellova Labs terms, privacy statement, and research-use disclosure.</span></label>}<button className="button button--spark button--wide" type="submit">{mode === "login" ? "Continue to account" : "Continue to registration"} <ArrowRight size={16} /></button></form>}</div></section></main>;
}

export function AccountPage() {
  usePageMeta("Account", "Cellova Labs customer account setup.");
  return <main className="page-main"><section className="site-width account-page"><div><p className="eyebrow eyebrow--spark">CELLOVA ACCOUNT</p><h1>Account access is prepared for the independent Cellova customer store.</h1><p>Shopify customer-account credentials and production customer registration will be enabled after the separate Cellova store is claimed and configured.</p><Link href="/access" className="button button--spark">Open customer access <ArrowRight size={17} /></Link></div><div className="account-page__panel"><FlaskConical size={30} /><p className="product-tech">ACCOUNT STATUS</p><h2>Store configuration in progress</h2><p>There is no connection to any previous catalog or customer database. Once configured, new customer records will be isolated to Cellova Labs.</p></div></section></main>;
}

const policyContent = {
  terms: ["Terms of use", "Cellova Labs provides research-use catalog information and materials. Site visitors are responsible for reviewing the applicable terms, disclosures, and any product documentation before placing an order.", "Product availability, pricing, and documentation are maintained through the independent Cellova Labs catalog and may change as that catalog is updated."],
  privacy: ["Privacy", "Cellova Labs will collect only the information needed to administer a customer account, order, or research-access process once its separate production integrations are configured.", "Production privacy disclosures, contact details, and retention practices should be finalized with the Cellova business contact information before public launch."],
  disclosures: ["Research disclosure", "Materials described in this catalog are presented for research use. The catalog should not be interpreted as medical advice, treatment guidance, or a statement of product suitability for human or veterinary use.", "Review product-specific records and lot documentation before relying on any catalog information for research planning."],
} as const;

export function PolicyPage() {
  const [, params] = useRoute<{ policy: keyof typeof policyContent }>("/policies/:policy");
  const content = policyContent[params?.policy ?? "disclosures"] ?? policyContent.disclosures;
  usePageMeta(content[0], `${content[0]} for Cellova Labs.`);
  return <main className="page-main"><article className="site-width policy-page"><p className="eyebrow eyebrow--spark">CELLOVA LABS / POLICY</p><h1>{content[0]}</h1><div className="policy-page__body"><p>{content[1]}</p><p>{content[2]}</p><p className="policy-page__revision">Last reviewed: September 2026. Production contact information and final legal review are required before launch.</p></div></article></main>;
}
