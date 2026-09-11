"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { commerce } from "@/lib/commerce";
import type { CommerceCart } from "@/lib/commerce/types";
import { useAuth } from "@/lib/auth/auth-store";

/**
 * Client cart store. All pricing comes from the active commerce provider
 * (mock today; Medusa/Shopify later) — the browser never calculates
 * authoritative prices itself.
 */

const CART_ID_KEY = "cellova.cartId";

interface CartContextValue {
  cart: CommerceCart | null;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  beginCheckout: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { customer } = useAuth();
  const [cart, setCart] = useState<CommerceCart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      try {
        const existingId = window.localStorage.getItem(CART_ID_KEY);
        if (existingId) {
          const existing = await commerce.getCart(existingId);
          if (existing) {
            if (!cancelled) setCart(existing);
            return;
          }
          window.localStorage.removeItem(CART_ID_KEY);
        }
      } catch {
        if (!cancelled) setError("We could not restore your Shopify cart. Please try again.");
      } finally {
        if (!cancelled) setIsReady(true);
      }
    }
    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: CommerceCart) => {
    setCart(next);
    window.localStorage.setItem(CART_ID_KEY, next.id);
  }, []);

  const clearExpiredCart = useCallback(() => {
    setCart(null);
    window.localStorage.removeItem(CART_ID_KEY);
  }, []);

  const recoverExpiredCart = useCallback(async (cartId: string) => {
    try {
      const current = await commerce.getCart(cartId);
      if (current) return false;
    } catch {
      // The following generic browser message avoids exposing upstream details.
    }
    clearExpiredCart();
    setError("Your Shopify cart has expired. Please add items again.");
    return true;
  }, [clearExpiredCart]);

  const addItem = useCallback(
    async (variantId: string, quantity: number) => {
      setIsLoading(true);
      setError(null);
      try {
        let current = cart;
        if (!current) {
          current = await commerce.createCart({ buyerEmail: customer?.email });
          persist(current);
        }
        let next: CommerceCart;
        try {
          next = await commerce.addCartItem(current.id, { variantId, quantity });
        } catch (error) {
          if (await recoverExpiredCart(current.id)) {
            const fresh = await commerce.createCart({ buyerEmail: customer?.email });
            next = await commerce.addCartItem(fresh.id, { variantId, quantity });
          } else {
            throw error;
          }
        }
        persist(next);
        setIsDrawerOpen(true);
      } catch {
        setError("We could not add this item to your Shopify cart. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [cart, customer, persist, recoverExpiredCart]
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      setIsLoading(true);
      setError(null);
      try {
        persist(await commerce.updateCartItem(cart.id, lineId, quantity));
      } catch {
        if (!(await recoverExpiredCart(cart.id))) {
          setError("We could not update your Shopify cart. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [cart, persist, recoverExpiredCart]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      setIsLoading(true);
      setError(null);
      try {
        persist(await commerce.removeCartItem(cart.id, lineId));
      } catch {
        if (!(await recoverExpiredCart(cart.id))) {
          setError("We could not update your Shopify cart. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [cart, persist, recoverExpiredCart]
  );

  const beginCheckout = useCallback(async () => {
    if (!cart) {
      setError("Your cart is empty. Add research materials before checkout.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const latest = await commerce.getCart(cart.id);
      if (!latest?.items.length || !latest.checkoutUrl) {
        clearExpiredCart();
        setError("Your Shopify cart is no longer available. Please add items again.");
        return;
      }
      persist(latest);
      window.location.assign(latest.checkoutUrl);
    } catch {
      if (!(await recoverExpiredCart(cart.id))) {
        setError("We could not start Shopify checkout. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [cart, clearExpiredCart, persist, recoverExpiredCart]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      isLoading,
      isReady,
      error,
      isDrawerOpen,
      openDrawer: () => setIsDrawerOpen(true),
      closeDrawer: () => setIsDrawerOpen(false),
      addItem,
      updateItem,
      removeItem,
      beginCheckout,
    }),
    [cart, isLoading, isReady, error, isDrawerOpen, addItem, updateItem, removeItem, beginCheckout]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
