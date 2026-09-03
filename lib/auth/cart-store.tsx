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

/**
 * Client cart store. All pricing comes from the active commerce provider
 * (mock today; Medusa/Shopify later) — the browser never calculates
 * authoritative prices itself.
 */

const CART_ID_KEY = "cellova.cartId";

interface CartContextValue {
  cart: CommerceCart | null;
  isLoading: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CommerceCart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
        }
        const fresh = await commerce.createCart();
        window.localStorage.setItem(CART_ID_KEY, fresh.id);
        if (!cancelled) setCart(fresh);
      } catch {
        // Cart boot failure is non-fatal for browsing.
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

  const addItem = useCallback(
    async (variantId: string, quantity: number) => {
      setIsLoading(true);
      try {
        let current = cart;
        if (!current) {
          current = await commerce.createCart();
          persist(current);
        }
        const next = await commerce.addCartItem(current.id, {
          variantId,
          quantity,
        });
        persist(next);
        setIsDrawerOpen(true);
      } finally {
        setIsLoading(false);
      }
    },
    [cart, persist]
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        persist(await commerce.updateCartItem(cart.id, lineId, quantity));
      } finally {
        setIsLoading(false);
      }
    },
    [cart, persist]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        persist(await commerce.removeCartItem(cart.id, lineId));
      } finally {
        setIsLoading(false);
      }
    },
    [cart, persist]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      isLoading,
      isDrawerOpen,
      openDrawer: () => setIsDrawerOpen(true),
      closeDrawer: () => setIsDrawerOpen(false),
      addItem,
      updateItem,
      removeItem,
    }),
    [cart, isLoading, isDrawerOpen, addItem, updateItem, removeItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
