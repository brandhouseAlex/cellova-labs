import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@shared/commerce/types";
import { useCart } from "@/contexts/CartContext";
import { useResearchAccess } from "@/contexts/ResearchAccessContext";
import { formatMoney } from "@/lib/cellova";

export function PurchasePanel({ product }: { product: Product }) {
  const { addItem, loading } = useCart();
  const { isAuthenticated, isReady } = useResearchAccess();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const variant = useMemo(() => product.variants.find(item => item.id === variantId) ?? product.variants[0], [product.variants, variantId]);

  async function addToCart() {
    if (!variant) return;
    setError(null);
    try {
      await addItem(variant.id, quantity);
    } catch {
      setError("Unable to add this material to the research order. Please try again.");
    }
  }

  if (isReady && !isAuthenticated) {
    return <section className="account-required-card"><p className="eyebrow eyebrow--spark">ACCOUNT REQUIRED TO ORDER</p><h3>Research-account approval comes first.</h3><p>Pricing and documentation are visible; ordering is reserved for research accounts that acknowledge the Cellova research-use terms.</p><div><Link className="button button--ink" href="/account">Log in</Link><Link className="button button--spark" href="/account?mode=register">Create account</Link></div></section>;
  }

  return <section className="purchase-panel" aria-label="Purchase controls"><p className="purchase-panel__price">{variant ? formatMoney(variant.price.amount, variant.price.currencyCode) : "Price pending"}{variant ? <span>/ {variant.title}</span> : null}</p>{product.options.map(option => <fieldset key={option.name}><legend>{option.name}</legend><div className="purchase-panel__variants">{product.variants.map(item => <button key={item.id} type="button" className={item.id === variant?.id ? "is-selected" : ""} aria-pressed={item.id === variant?.id} onClick={() => setVariantId(item.id)}>{item.selectedOptions.find(value => value.name === option.name)?.value || item.title}</button>)}</div></fieldset>)}<div className="purchase-panel__action-row"><div className="quantity-stepper"><button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(value => Math.max(1, value - 1))}><Minus size={16} /></button><input type="number" min={1} max={99} value={quantity} onChange={event => setQuantity(Math.max(1, Math.min(99, Number(event.target.value) || 1)))} /><button type="button" aria-label="Increase quantity" onClick={() => setQuantity(value => Math.min(99, value + 1))}><Plus size={16} /></button></div><button type="button" className="button button--spark purchase-panel__add" disabled={!variant?.availableForSale || loading} onClick={addToCart}><ShoppingBag size={17} />{loading ? "Adding…" : variant?.availableForSale ? "Add to research order" : "Unavailable"}</button></div>{error && <p role="alert" className="purchase-panel__error">{error}</p>}</section>;
}
