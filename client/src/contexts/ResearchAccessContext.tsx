import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const ACCOUNT_KEY = "cellova.research-account";
const SESSION_KEY = "cellova.research-session";

export type ResearchAccount = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  createdAt: string;
  status: "pending" | "approved";
};

type RegistrationInput = Omit<ResearchAccount, "createdAt" | "status"> & { password: string; acceptsResearchUseTerms: boolean };
type LoginInput = { email: string; password: string };
type AccessResult = { success: boolean; error?: string };

export type ResearchAccessContextValue = {
  account: ResearchAccount | null;
  isAuthenticated: boolean;
  isReady: boolean;
  register: (input: RegistrationInput) => Promise<AccessResult>;
  login: (input: LoginInput) => Promise<AccessResult>;
  logout: () => void;
};

export const ResearchAccessContext = createContext<ResearchAccessContextValue | null>(null);

/**
 * Preview-compatible access session. The provider-neutral customer API can
 * replace this adapter later without changing the gate, account, or PDP UI.
 */
export function ResearchAccessProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<ResearchAccount | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const session = window.localStorage.getItem(SESSION_KEY);
      const stored = window.localStorage.getItem(ACCOUNT_KEY);
      if (session === "active" && stored) {
        const parsed = JSON.parse(stored) as ResearchAccount;
        setAccount({ ...parsed, status: parsed.status === "approved" ? "approved" : "pending" });
      }
    } catch {
      window.localStorage.removeItem(SESSION_KEY);
    } finally {
      setIsReady(true);
    }
  }, []);

  const register = useCallback(async (input: RegistrationInput): Promise<AccessResult> => {
    if (!input.acceptsResearchUseTerms) return { success: false, error: "Research-use acknowledgement is required." };
    if (input.password.trim().length < 8) return { success: false, error: "Use a password with at least 8 characters." };
    const nextAccount: ResearchAccount = {
      firstName: input.firstName.trim(), lastName: input.lastName.trim(), email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(), companyName: input.companyName.trim(), createdAt: new Date().toISOString(), status: "pending",
    };
    try {
      window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(nextAccount));
      window.localStorage.setItem(SESSION_KEY, "active");
      setAccount(nextAccount);
      return { success: true };
    } catch {
      return { success: false, error: "This browser could not save your access session." };
    }
  }, []);

  const login = useCallback(async (input: LoginInput): Promise<AccessResult> => {
    try {
      const raw = window.localStorage.getItem(ACCOUNT_KEY);
      const stored = raw ? JSON.parse(raw) as ResearchAccount : null;
      if (!stored || stored.email !== input.email.trim().toLowerCase() || input.password.trim().length < 8) {
        return { success: false, error: "No matching research account was found. Create an account to continue." };
      }
      const normalized = { ...stored, status: stored.status === "approved" ? "approved" : "pending" } as ResearchAccount;
      window.localStorage.setItem(SESSION_KEY, "active");
      setAccount(normalized);
      return { success: true };
    } catch {
      return { success: false, error: "This browser could not restore your access session." };
    }
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY);
    setAccount(null);
  }, []);

  const value = useMemo(() => ({ account, isAuthenticated: account?.status === "approved", isReady, register, login, logout }), [account, isReady, register, login, logout]);
  return <ResearchAccessContext.Provider value={value}>{children}</ResearchAccessContext.Provider>;
}

export function useResearchAccess() {
  const context = useContext(ResearchAccessContext);
  if (!context) throw new Error("useResearchAccess must be used within ResearchAccessProvider");
  return context;
}
