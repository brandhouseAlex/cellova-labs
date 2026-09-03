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
import type {
  CommerceAuthInput,
  CommerceAuthResult,
  CommerceCustomer,
  CommerceRegisterInput,
} from "@/lib/commerce/types";

/**
 * Client auth store backed by the active commerce provider's customer
 * authentication (mock today; Medusa/Shopify later). The mock adapter
 * keeps a demo session in localStorage — replace by switching providers,
 * not by redesigning components.
 */

const SESSION_KEY = "cellova.session";

interface AuthContextValue {
  customer: CommerceCustomer | null;
  isAuthenticated: boolean;
  /** True until the first session check completes (avoids gate flash). */
  isReady: boolean;
  login: (input: CommerceAuthInput) => Promise<CommerceAuthResult>;
  register: (input: CommerceRegisterInput) => Promise<CommerceAuthResult>;
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
        const token = window.localStorage.getItem(SESSION_KEY);
        if (token) {
          const existing = await commerce.getCustomer(token);
          if (!cancelled && existing) setCustomer(existing);
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

  const login = useCallback(async (input: CommerceAuthInput) => {
    const result = await commerce.login(input);
    if (result.success && result.customer) {
      setCustomer(result.customer);
      window.localStorage.setItem(SESSION_KEY, "mock_session");
    }
    return result;
  }, []);

  const register = useCallback(async (input: CommerceRegisterInput) => {
    const result = await commerce.register(input);
    if (result.success && result.customer) {
      setCustomer(result.customer);
      window.localStorage.setItem(SESSION_KEY, "mock_session");
    }
    return result;
  }, []);

  const logout = useCallback(async () => {
    await commerce.logout();
    window.localStorage.removeItem(SESSION_KEY);
    setCustomer(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      customer,
      isAuthenticated: customer !== null,
      isReady,
      login,
      register,
      logout,
    }),
    [customer, isReady, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
