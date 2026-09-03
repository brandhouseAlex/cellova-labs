"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ShoppingBag, X, Minus, Plus, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { Cart } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/commerce/format";

type CartContextValue = { cart: Cart | null; itemCount: number; isOpen: boolean; loading: boolean; error: string | null; openCart: () => void; closeCart: () => void; addItem: (variantId: string, quantity?: number) => Promise<void>; updateQuantity: (lineId: string, quantity: number) => Promise<void>; removeItem: (lineId: string) => Promise<void>; proceedToCheckout: () => void; };
const CartContext = createContext<CartContextValue | undefined>(undefined);
const cartKey = "cellova-cart-id";

async function cartRequest(action: string, body: Record<string, unknown>) {
  const query = action === "get" && typeof body.cartId === "string" ? `?cartId=${encodeURIComponent(body.cartId)}` : "";
  const response = await fetch(`/api/cart/${action}${query}`, { method: action === "get" ? "GET" : "POST", headers: { "Content-Type": "application/json" }, body: action === "get" ? undefined : JSON.stringify(body) });
  const payload = await response.json() as { cart?: Cart; message?: string };
  if (!response.ok || !payload.cart) throw new Error(payload.message ?? "Your cart could not be updated. Please try again.");
  return payload.cart;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null); const [isOpen, setOpen] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null);
  useEffect(() => { const cartId = localStorage.getItem(cartKey); if (!cartId) return; cartRequest("get", { cartId }).then(setCart).catch(() => localStorage.removeItem(cartKey)); }, []);
  const run = useCallback(async (work: () => Promise<Cart>) => { setLoading(true); setError(null); try { const next = await work(); setCart(next); localStorage.setItem(cartKey, next.id); setOpen(true); } catch (cause) { setError(cause instanceof Error ? cause.message : "Your cart could not be updated."); } finally { setLoading(false); } }, []);
  const addItem = useCallback(async (variantId: string, quantity = 1) => { await run(() => cart ? cartRequest("add", { cartId: cart.id, lines: [{ variantId, quantity }] }) : cartRequest("create", { lines: [{ variantId, quantity }] })); }, [cart, run]);
  const updateQuantity = useCallback(async (lineId: string, quantity: number) => { if (!cart) return; await run(() => cartRequest("update", { cartId: cart.id, lines: [{ lineId, quantity }] })); }, [cart, run]);
  const removeItem = useCallback(async (lineId: string) => { if (!cart) return; await run(() => cartRequest("remove", { cartId: cart.id, lineIds: [lineId] })); }, [cart, run]);
  const value = useMemo<CartContextValue>(() => ({ cart, itemCount: cart?.itemCount ?? 0, isOpen, loading, error, openCart: () => setOpen(true), closeCart: () => setOpen(false), addItem, updateQuantity, removeItem, proceedToCheckout: () => { if (cart?.checkoutUrl) window.location.assign(cart.checkoutUrl); } }), [cart, isOpen, loading, error, addItem, updateQuantity, removeItem]);
  return <CartContext.Provider value={value}>{children}<CartDrawer /></CartContext.Provider>;
}

export function useCart() { const context = useContext(CartContext); if (!context) throw new Error("useCart must be used within CartProvider"); return context; }

function CartDrawer() {
  const { cart, itemCount, isOpen, closeCart, loading, error, updateQuantity, removeItem, proceedToCheckout } = useCart();
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-[70] flex justify-end bg-[color:var(--ink)]/45 p-0 sm:p-3" role="dialog" aria-modal="true" aria-label="Shopping cart"><div className="flex h-full w-full max-w-md flex-col bg-[color:var(--paper)] shadow-2xl sm:rounded-2xl"><div className="flex items-center justify-between border-b border-[color:var(--line)] px-6 py-5"><div><p className="eyebrow">Cart</p><h2 className="font-display text-xl text-[color:var(--indigo)]">Your selection <span className="font-mono text-xs text-[color:var(--slate)]">({itemCount})</span></h2></div><button onClick={closeCart} className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--line)]" aria-label="Close cart"><X size={19} /></button></div><div className="flex-1 overflow-y-auto px-6 py-5">{error && <p className="mb-4 rounded-lg border border-[#ba503d]/30 bg-[#fff3ef] p-3 text-sm text-[#8e3c2d]">{error}</p>}{!cart?.items.length ? <div className="grid h-full place-items-center text-center"><div><ShoppingBag className="mx-auto text-[color:var(--slate)]" size={30} strokeWidth={1.4} /><h3 className="mt-4 font-display text-xl text-[color:var(--indigo)]">Your cart is ready.</h3><p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">Add a product when you are ready to continue.</p></div></div> : <ul className="space-y-5">{cart.items.map((item) => <li key={item.lineId} className="flex gap-4 border-b border-[color:var(--line)] pb-5"><div className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-white p-2">{item.image ? <Image src={item.image.url} alt={item.image.altText ?? item.productTitle} fill sizes="80px" className="object-contain p-2" /> : <ShoppingBag size={20} className="text-[color:var(--slate)]" />}</div><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><div><h3 className="font-display text-[0.93rem] text-[color:var(--indigo)]">{item.productTitle}</h3>{item.variantTitle !== "Default Title" && <p className="mt-1 font-mono text-[0.63rem] uppercase tracking-wide text-[color:var(--slate)]">{item.variantTitle}</p>}</div><button onClick={() => removeItem(item.lineId)} disabled={loading} className="text-[0.63rem] font-bold uppercase tracking-wide text-[color:var(--muted)] underline underline-offset-4">Remove</button></div><div className="mt-4 flex items-center justify-between"><div className="flex items-center rounded-md border border-[color:var(--line)]"><button disabled={loading} onClick={() => updateQuantity(item.lineId, item.quantity - 1)} className="grid h-7 w-7 place-items-center" aria-label="Decrease quantity"><Minus size={12} /></button><span className="w-6 text-center font-mono text-xs">{item.quantity}</span><button disabled={loading} onClick={() => updateQuantity(item.lineId, item.quantity + 1)} className="grid h-7 w-7 place-items-center"><Plus size={12} /></button></div><span className="text-sm font-bold">{formatMoney(item.lineTotal)}</span></div></div></li>)}</ul>}</div>{cart?.items.length ? <div className="border-t border-[color:var(--line)] px-6 py-5"><div className="flex justify-between text-sm font-bold text-[color:var(--indigo)]"><span>Subtotal</span><span>{formatMoney(cart.subtotal)}</span></div><p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">Taxes and shipping are calculated at secure checkout.</p><button onClick={proceedToCheckout} disabled={loading} className="button-primary mt-5 w-full">Continue to checkout <ArrowUpRight size={15} /></button></div> : null}</div></div>;
}
