"use client";

import { useState } from "react";

/**
 * Newsletter capture for the "Get Exclusive Updates" panel.
 * Demo-grade: stores the address in localStorage and confirms inline.
 * Wire to a real ESP (Route Handler) before production.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "done" | "error">("idle");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setState("error");
      return;
    }
    try {
      const existing = JSON.parse(
        window.localStorage.getItem("cellova.newsletter") ?? "[]"
      ) as string[];
      if (!existing.includes(value)) existing.push(value);
      window.localStorage.setItem("cellova.newsletter", JSON.stringify(existing));
    } catch {
      // storage unavailable — still confirm to the user
    }
    setState("done");
  }

  if (state === "done") {
    return (
      <p className="flex items-center gap-2 rounded-[6px] border border-brand-bright/40 bg-brand-bright/10 px-4 py-3 text-sm text-brand-bright">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        You&apos;re on the list — watch for new compound drops.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="relative flex flex-col gap-2 sm:flex-row" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (state === "error") setState("idle");
        }}
        placeholder="Enter your email"
        className="h-12 flex-1 rounded-[6px] border border-paper/20 bg-paper/10 px-4 text-sm text-paper placeholder:text-paper/50 focus:border-brand-bright focus:outline-none"
      />
      <button
        type="submit"
        className="h-12 rounded-[6px] bg-brand px-6 text-sm font-medium uppercase tracking-[0.12em] text-paper transition-all duration-200 hover:bg-brand-bright hover:text-ink active:scale-95"
      >
        Subscribe
      </button>
      {state === "error" && (
        <p className="text-xs text-brand-bright sm:absolute sm:-bottom-6 sm:left-0">
          Please enter a valid email address.
        </p>
      )}
    </form>
  );
}
