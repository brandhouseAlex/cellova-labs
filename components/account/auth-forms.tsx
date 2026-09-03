"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-store";
import { Field, TextInput } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/**
 * Login / registration forms backed by the active commerce provider's
 * customer authentication (mock adapter today; Medusa/Shopify later).
 */
export function AuthForms() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<"login" | "register">(
    searchParams.get("mode") === "register" ? "register" : "login"
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      const result =
        mode === "login"
          ? await login({ email, password })
          : await register({
              email,
              password,
              firstName: String(form.get("firstName") ?? ""),
              lastName: String(form.get("lastName") ?? ""),
              acceptsResearchUseTerms: acknowledged,
            });

      if (result.success) {
        router.push("/account");
        router.refresh();
      } else {
        setError(result.error ?? "Something went wrong. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      {/* Mode switch */}
      <div
        role="tablist"
        aria-label="Account access"
        className="grid grid-cols-2 border border-line"
      >
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={cn(
              "px-4 py-3 text-xs font-medium uppercase tracking-[0.16em] transition-colors",
              mode === m
                ? "bg-ink text-paper"
                : "bg-paper text-slate hover:text-ink"
            )}
          >
            {m === "login" ? "Login" : "Create Account"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {mode === "register" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First Name" htmlFor="firstName">
              <TextInput
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                required
              />
            </Field>
            <Field label="Last Name" htmlFor="lastName">
              <TextInput
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                required
              />
            </Field>
          </div>
        ) : null}

        <Field label="Email" htmlFor="email">
          <TextInput
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@laboratory.com"
          />
        </Field>

        <Field
          label="Password"
          htmlFor="password"
          hint={
            mode === "register" ? "Minimum 8 characters." : undefined
          }
        >
          <TextInput
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={mode === "register" ? 8 : 6}
          />
        </Field>

        {mode === "register" ? (
          <label
            htmlFor="research-ack"
            className="flex cursor-pointer items-start gap-3 border border-line bg-mist p-4"
          >
            <input
              id="research-ack"
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
            />
            <span className="text-xs leading-relaxed text-slate">
              I confirm that I am at least 21 years of age and understand that
              all products offered by Cellova Labs are intended strictly for
              laboratory research use and are not for human or animal
              consumption.
            </span>
          </label>
        ) : null}

        {error ? (
          <p
            role="alert"
            className="border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy || (mode === "register" && !acknowledged)}
          className="w-full bg-ink px-8 py-4 text-sm font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy
            ? "Please wait…"
            : mode === "login"
              ? "Login"
              : "Create Research Account"}
        </button>

        {mode === "login" ? (
          <div className="text-center">
            <button
              type="button"
              onClick={() => setForgotSent(true)}
              className="text-xs uppercase tracking-[0.14em] text-slate underline-offset-2 hover:text-ink hover:underline"
            >
              Forgot your password?
            </button>
            {forgotSent ? (
              <p role="status" className="mt-2 text-xs text-silver">
                Password reset will be handled by the connected commerce
                provider (Medusa or Shopify) at launch.
              </p>
            ) : null}
          </div>
        ) : null}
      </form>

      <p className="mt-8 text-center text-xs leading-relaxed text-silver">
        By continuing you agree to the{" "}
        <Link href="/policies/terms" className="text-brand underline-offset-2 hover:underline">
          Terms of Use
        </Link>
        ,{" "}
        <Link href="/policies/privacy" className="text-brand underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
        , and{" "}
        <Link href="/policies/research-use" className="text-brand underline-offset-2 hover:underline">
          Research Use Policy
        </Link>
        .
      </p>
    </div>
  );
}
