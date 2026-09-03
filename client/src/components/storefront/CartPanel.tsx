/**
 * Visual style: an Ink dossier drawer with spacious line items and a single
 * Spark conversion action. The panel reports live Shopify cart state only.
 */
import { X, Minus, Plus, ShoppingBag, AlertCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CELLLOVA_ASSETS, formatMoney } from "@/lib/cellova";

export function CartPanel() {
  const { cart, isOpen, loading, error, itemCount, closeCart, clearError, removeItem, updateQuantity, proceedToCheckout } = useCart();
  if (!isOpen) return null;

  return (
    <div className="cart-layer" role="dialog" aria-modal="true" aria-labelledby="cart-panel-title">
      <button className="cart-layer__backdrop" aria-label="Close cart" onClick={closeCart} />
      <aside className="cart-panel">
        <div className="cart-panel__heading">
          <div>
            <p className="eyebrow eyebrow--spark">ORDER REGISTER</p>
            <h2 id="cart-panel-title">Your cart <span>{itemCount}</span></h2>
          </div>
          <button type="button" className="cart-panel__close" onClick={closeCart} aria-label="Close cart"><X size={21} /></button>
        </div>
        {error && <div className="cart-error" role="alert"><AlertCircle size={17} /><span>{error}</span><button type="button" onClick={clearError} aria-label="Dismiss cart message"><X size={15} /></button></div>}
        {!cart?.items.length ? (
          <div className="cart-empty">
            <ShoppingBag size={28} strokeWidth={1.4} />
            <h3>No materials selected.</h3>
            <p>Use the catalog to review available research materials and documentation.</p>
          </div>
        ) : (
          <div className="cart-items">
            {cart.items.map(item => (
              <article className="cart-item" key={item.lineId}>
                <img src={item.image?.url || CELLLOVA_ASSETS.product} alt={item.image?.altText || `${item.productTitle} product presentation`} />
                <div className="cart-item__content">
                  <p className="product-tech">{item.variantTitle === "Default Title" ? "CATALOG MATERIAL" : item.variantTitle}</p>
                  <h3>{item.productTitle}</h3>
                  <p>{formatMoney(item.unitPrice.amount, item.unitPrice.currencyCode)}</p>
                  <div className="quantity-control" aria-label={`Quantity for ${item.productTitle}`}>
                    <button type="button" disabled={loading || item.quantity <= 1} onClick={() => updateQuantity(item.lineId, item.quantity - 1)} aria-label="Decrease quantity"><Minus size={13} /></button>
                    <span>{item.quantity}</span>
                    <button type="button" disabled={loading} onClick={() => updateQuantity(item.lineId, item.quantity + 1)} aria-label="Increase quantity"><Plus size={13} /></button>
                  </div>
                  <button type="button" className="text-action" disabled={loading} onClick={() => removeItem(item.lineId)}>Remove</button>
                </div>
                <p className="cart-item__total">{formatMoney(item.lineTotal.amount, item.lineTotal.currencyCode)}</p>
              </article>
            ))}
          </div>
        )}
        <div className="cart-panel__footer">
          <div className="cart-total"><span>Subtotal</span><strong>{cart ? formatMoney(cart.subtotal.amount, cart.subtotal.currencyCode) : "$0.00"}</strong></div>
          <p>Shipping and taxes are calculated by Shopify at checkout.</p>
          <button type="button" className="button button--spark button--wide" onClick={proceedToCheckout} disabled={!cart?.items.length || loading}>
            Continue to Shopify checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
