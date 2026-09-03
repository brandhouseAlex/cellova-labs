"use client";

import { Suspense } from "react";
import { useAuth } from "@/lib/auth/auth-store";
import { AuthForms } from "@/components/account/auth-forms";
import { AccountDashboard } from "@/components/account/account-dashboard";

// This route is private and client-driven; metadata is set in the
// sibling head via the layout template and marked noindex in robots.ts.
export default function AccountPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <Suspense fallback={null}>
        <AccountPageInner />
      </Suspense>
    </div>
  );
}

function AccountPageInner() {
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return (
      <div className="py-24 text-center text-sm text-slate" role="status">
        Loading your account…
      </div>
    );
  }

  return (
    <>
      <header className={isAuthenticated ? "" : "text-center"}>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">
          Cellova Labs Research Network
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
          {isAuthenticated ? "Account" : "Account Access"}
        </h1>
        {!isAuthenticated ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate">
            Sign in to your research account to order materials, review order
            history, and access batch documentation.
          </p>
        ) : null}
      </header>
      <div className="mt-10">
        {isAuthenticated ? <AccountDashboard /> : <AuthForms />}
      </div>
    </>
  );
}
