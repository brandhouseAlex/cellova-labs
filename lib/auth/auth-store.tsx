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
import type { CommerceCustomer } from "@/lib/commerce/types";

/**
 * Client view of the server-owned Cellova session. The browser never reads or
 * writes a credential, Shopify token, eligibility value, or customer ID.
 */

interface AuthContextValue {
  customer: CommerceCustomer | null;
  isAuthenticated: boolean;
  /** True until the first session check completes (avoids gate flash). */
  isReady: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<CommerceCustomer | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      try {
        const response = await fetch("/api/access/session", { credentials: "include", cache: "no-store" });
        if (response.ok) {
          const payload = (await response.json()) as { customer?: CommerceCustomer };
          if (!cancelled && payload.customer) setCustomer(payload.customer);
        }
      } catch {
        // Non-fatal: user simply appears signed out.
      } finally {
        if (!cancelled) setIsReady(true);
      }
    }
    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    setCustomer(null);
    window.location.href = new URL("/api/access/logout", window.location.origin).toString();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      customer,
      isAuthenticated: customer !== null,
      isReady,
      logout,
    }),
    [customer, isReady, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
