"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth/auth-store";
import { CartProvider } from "@/lib/auth/cart-store";
import { CartDrawer } from "@/components/cart/cart-drawer";

/** Composes the client-side stores around the server-rendered tree. */
export function StoreProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </AuthProvider>
  );
}
