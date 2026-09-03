/**
 * Visual style: restrained Paper product cards with one dark status label,
 * structured mono metadata, and Spark reserved for the product action.
 */
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { CELLLOVA_ASSETS, formatMoney } from "@/lib/cellova";

type ProductGridProps = { title?: string; description?: string; className?: string };

export function ProductGrid({ title, description, className = "" }: ProductGridProps) {
  const productsQuery = trpc.commerce.products.list.useQuery({ first: 12 });
  const products = productsQuery.data ?? [];

  return (
    <section className={`product-grid-section ${className}`} aria-labelledby={title ? "product-grid-title" : undefined}>
      {(title || description) && (
        <div className="product-grid-section__heading">
          <div>
            {title && <p className="eyebrow eyebrow--spark">CATALOG</p>}
            {title && <h2 id="product-grid-title">{title}</h2>}
          </div>
          {description && <p>{description}</p>}
        </div>
      )}
      {productsQuery.isLoading && <div className="product-grid product-grid--loading" aria-label="Loading catalog"><div /><div /><div /></div>}
      {productsQuery.isError && <div className="inline-notice">The catalog is temporarily unavailable. Please refresh or try again shortly.</div>}
      {!productsQuery.isLoading && !productsQuery.isError && products.length === 0 && (
        <div className="empty-catalog"><p className="eyebrow">CATALOG INITIALIZATION</p><h3>Products will appear here as they are published to the Cellova Labs store.</h3><p>The storefront is ready for its separate catalog and lot documentation.</p></div>
      )}
      {!!products.length && <div className="product-grid">
        {products.map(product => {
          const image = product.images[0];
          const status = product.tags.includes("documentation-pending") ? "Documentation pending" : product.variants.some(variant => variant.availableForSale) ? "Available" : "Not currently available";
          return (
            <article className="product-card" key={product.id}>
              <div className="product-card__image-wrap">
                <span className="product-card__status">{status}</span>
                <img src={image?.url || CELLLOVA_ASSETS.product} alt={image?.altText || `${product.title} product presentation`} className="product-card__image" />
              </div>
              <div className="product-card__body">
                <p className="product-tech">{product.productType || "RESEARCH MATERIAL"}</p>
                <h3>{product.title}</h3>
                <p className="product-card__spec">{product.vendor === "Cellova Labs" ? "Cellova catalog record" : product.vendor || "Catalog record"}</p>
                <div className="product-card__footer">
                  <strong>{formatMoney(product.priceRange.min.amount, product.priceRange.min.currencyCode)}</strong>
                  <Link href={`/catalog/${product.handle}`} className="button button--spark button--small">View details <ArrowUpRight size={15} /></Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>}
    </section>
  );
}
