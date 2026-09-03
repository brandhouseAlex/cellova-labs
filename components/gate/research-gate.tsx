"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth/auth-store";
import { cn } from "@/lib/utils";
import { ResearchDataWave } from "@/components/gate/research-data-wave";

/**
 * Cellova Labs Research Network gate.
 *
 * Shown to unauthenticated visitors as the entry surface for the Cellova Labs
 * Research Network. It deliberately has no guest-dismissal path: existing
 * provider authentication determines when the visitor gains access.
 */
export function ResearchGate() {
  const { isAuthenticated, login, register } = useAuth();
  const pathname = usePathname();
  // This is the user's supplied RGBA dark-mode mark, rendered without a
  // rectangular background over the gate's Ink research surface.
  const [logoSrc] = useState("/brand/cellova-wordmark.webp");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [acknowledged, setAcknowledged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Authenticated users never see the gate.
  // Do not allow a stalled client readiness check to expose the catalog.
  // An authenticated customer dismisses the gate immediately after session
  // hydration; an unauthenticated customer sees the gate from first paint.
  const informationalRoute =
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname.startsWith("/policies/");
  const visible = !isAuthenticated && !informationalRoute;

  // Lock scroll while the gate is visible
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [visible]);

  if (!visible) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    try {
      const result = mode === "login"
        ? await login({ email, password })
        : await register({
            firstName: String(form.get("firstName") ?? "").trim(),
            lastName: String(form.get("lastName") ?? "").trim(),
            email,
            phone: String(form.get("phone") ?? "").trim(),
            companyName: String(form.get("companyName") ?? "").trim(),
            password,
            acceptsResearchUseTerms: acknowledged,
            researchUseConsentVersion: "research-network-v1.0",
          });

      if (!result.success) {
        setError(result.error ?? "We could not complete that request. Please try again.");
      } else if (!remember) {
        // The current client session remains active for this browser visit.
        // Provider-backed persistence will be added with the Shopify account integration.
      }
    } catch {
      setError("A connection error occurred. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="research-gate-title"
      className="fixed inset-0 z-[90] overflow-y-auto bg-[#12141C] text-paper"
    >
      <div className="grid-texture pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto grid min-h-[100svh] w-full max-w-[1560px] lg:min-h-[min(900px,calc(100svh-2rem))] lg:grid-cols-[1fr_0.96fr] lg:items-stretch lg:p-4">
        {/* Left: identity and animated signal field. */}
        <section className="gate-brand-panel relative flex min-h-[360px] overflow-hidden px-6 py-8 sm:px-10 sm:py-10 lg:min-h-0 lg:self-stretch lg:rounded-l-[24px] lg:px-[clamp(2.5rem,6vw,6.5rem)] lg:py-[clamp(2.5rem,5vw,5rem)]">
          <ResearchDataWave />
          <div className="relative z-10 flex w-full flex-col animate-gate-enter">
            <div className="relative h-14 w-[200px] sm:h-[72px] sm:w-[255px]">
              <Image src={logoSrc} alt="Cellova Labs" fill priority sizes="255px" className="object-contain object-left" />
            </div>
            <div className="mt-10 max-w-sm lg:mt-[clamp(3rem,8vh,8rem)]">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F8C36A]">
                <GateIcon name="shield" className="h-4 w-4" /> Research use only
              </p>
              <h1 className="mt-6 font-display text-[clamp(2.45rem,4vw,4.85rem)] font-semibold leading-[0.97] tracking-tight text-paper">
                Join the<br /><span className="text-[#F2A63C]">Cellova</span><br />Research Network
              </h1>
              <span className="mt-6 block h-px w-14 bg-[#F8C36A]" />
              <p className="mt-6 max-w-sm text-sm leading-6 text-[#d2d7d0] sm:text-base sm:leading-7">Access to a curated catalog of research-grade peptides and compounds along with supporting scientific information.</p>
            </div>
            <div className="mt-auto pt-9 lg:pt-12">
              <CredentialGrid />
            </div>
          </div>
        </section>

        {/* Right: account entry. */}
        <section className="relative z-20 flex items-center bg-[#F3F4F1] px-4 py-6 sm:px-8 sm:py-10 lg:-ml-7 lg:self-stretch lg:rounded-r-[24px] lg:px-[clamp(2.5rem,5vw,5.5rem)]">
          <div className="w-full animate-gate-panel-enter">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-deep"><GateIcon name="lock" className="h-4 w-4" /> Registration required</p>
            <h2 id="research-gate-title" className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Welcome to Cellova Labs</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate">Access to a curated catalog of research-grade peptides and compounds along with supporting scientific information.</p>
            <p className="mt-4 text-sm font-semibold text-ink">Please log in or create an account to continue.</p>

            <div className="mt-7 rounded-[9px] border border-[#dbe8cd] bg-[#FFF1DB] px-4 py-3.5">
              <label htmlFor="gate-consent" className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-slate">
                <input id="gate-consent" type="checkbox" checked={acknowledged} onChange={(event) => setAcknowledged(event.target.checked)} className="gate-checkbox mt-0.5 h-4 w-4 shrink-0" />
                <span>By proceeding, I confirm that I am 21 years of age or older and that all products will be used strictly for research purposes.</span>
              </label>
            </div>

            <div role="tablist" aria-label="Research network access" className="relative mt-7 grid grid-cols-2 border-b border-line">
              <span aria-hidden="true" className={cn("absolute bottom-[-1px] h-0.5 w-1/2 bg-brand transition-transform duration-300", mode === "register" && "translate-x-full")} />
              <button type="button" role="tab" aria-selected={mode === "login"} onClick={() => { setMode("login"); setError(null); }} className={cn("px-3 pb-3 text-sm font-semibold transition-colors", mode === "login" ? "text-brand-deep" : "text-slate hover:text-ink")}>Log In</button>
              <button type="button" role="tab" aria-selected={mode === "register"} onClick={() => { setMode("register"); setError(null); }} className={cn("px-3 pb-3 text-sm font-semibold transition-colors", mode === "register" ? "text-brand-deep" : "text-slate hover:text-ink")}>Create Account</button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === "register" ? <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <GateField label="First name" name="firstName" autoComplete="given-name" required />
                  <GateField label="Last name" name="lastName" autoComplete="family-name" required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <GateField label="Phone number" name="phone" type="tel" autoComplete="tel" placeholder="+1 555 000 0000" required />
                  <GateField label="Company name" name="companyName" autoComplete="organization" required />
                </div>
              </> : null}
              <GateField label="Email address" name="email" type="email" autoComplete="email" placeholder="Enter your email address" icon="mail" required />
              <GateField label="Password" name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={mode === "register" ? 8 : 6} icon="lock" required endAdornment={<button type="button" onClick={() => setShowPassword((visiblePassword) => !visiblePassword)} className="text-silver transition-colors hover:text-brand-deep" aria-label={showPassword ? "Hide password" : "Show password"}><GateIcon name={showPassword ? "eyeOff" : "eye"} className="h-4 w-4" /></button>} />

              {mode === "login" ? <div className="flex items-center justify-between gap-4 pt-0.5 text-xs">
                <label className="flex cursor-pointer items-center gap-2 text-slate"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="gate-checkbox h-3.5 w-3.5" /> Remember me</label>
                <Link href="/contact" className="font-medium text-brand-deep hover:underline">Forgot password?</Link>
              </div> : null}

              {error ? <p role="alert" className="rounded-[7px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
              <button type="submit" disabled={busy || (mode === "register" && !acknowledged)} className="gate-submit w-full rounded-[7px] px-5 py-4 text-sm font-semibold text-paper shadow-[0_12px_24px_-14px_rgba(45,52,82,0.8)] disabled:cursor-not-allowed disabled:opacity-45">
                {busy ? "Please wait…" : mode === "login" ? "Log In to Your Account  →" : "Create Your Research Account  →"}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3 rounded-[8px] bg-[#FFF1DB] px-4 py-3 text-xs leading-relaxed text-slate"><GateIcon name="shield" className="h-5 w-5 shrink-0 text-brand-deep" /><span>All products are for research use only. Not for human or animal consumption.</span></div>
            <nav aria-label="Policies" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate"><Link href="/policies/terms" className="hover:text-brand-deep">Terms of Use</Link><Link href="/policies/privacy" className="hover:text-brand-deep">Privacy Policy</Link><Link href="/policies/research-use" className="hover:text-brand-deep">Research Use Policy</Link></nav>
          </div>
        </section>
      </div>
    </div>
  );
}

function GateField({ label, icon, endAdornment, ...input }: { label: string; name: string; type?: string; autoComplete?: string; placeholder?: string; minLength?: number; required?: boolean; icon?: string; endAdornment?: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">{label}</span><span className="gate-input-shell flex items-center gap-3 rounded-[7px] border border-line bg-paper px-3.5 py-3 transition-all duration-200">{icon ? <GateIcon name={icon} className="h-4 w-4 shrink-0 text-silver" /> : null}<input {...input} className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-silver" />{endAdornment}</span></label>;
}

function CredentialGrid() {
  const credentials = [["shield", "99%+", "Purity guaranteed"], ["flask", "Research-Grade", "Products"], ["badge", "Third-party", "Tested"], ["doc", "COAs on", "Every batch"], ["years", "12+ years", "Of experience"], ["pin", "USA", "Manufactured"]] as const;
  return <div className="grid grid-cols-3 overflow-hidden rounded-[10px] border border-[#F8C36A]/15 bg-black/20 backdrop-blur-sm">{credentials.map(([icon, first, second], index) => <div key={first} className={cn("group min-h-[92px] border-[#F8C36A]/15 p-3.5 transition-colors duration-200 hover:bg-[#F2A63C]/10", index % 3 !== 2 && "border-r", index < 3 && "border-b")}><GateIcon name={icon} className="h-5 w-5 text-[#F8C36A] transition-transform duration-200 group-hover:-translate-y-0.5" /><p className="mt-3 text-[10px] font-semibold uppercase leading-4 tracking-[0.08em] text-paper">{first}<br />{second}</p></div>)}</div>;
}

function GateIcon({ name, className }: { name: string; className?: string }) {
  const paths: Record<string, string> = { shield: "M12 3l7 3v5c0 4.4-3 8.4-7 10-4-1.6-7-5.6-7-10V6l7-3z M9 12l2 2 4-4", lock: "M6 11V8a6 6 0 1 1 12 0v3M5 11h14v10H5z", mail: "M3 5h18v14H3zM3 7l9 6 9-6", eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", eyeOff: "M3 3l18 18M10.6 5.7A9.5 9.5 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17.5 17.5 0 0 1-3.2 3.8M6.2 6.2A17.6 17.6 0 0 0 2.5 12S6 18.5 12 18.5c1.3 0 2.5-.3 3.5-.8M9.9 9.9a3 3 0 0 0 4.2 4.2", flask: "M9 3h6M10 3v6L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3M7.5 14h9", badge: "M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM8.5 13.5L7 22l5-3 5 3-1.5-8.5", doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h5M10 17h5", years: "M4 4h16v16H4zM8 2v4M16 2v4M7 10h10M8 14h3M13 14h3M8 18h3", pin: "M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" };
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] ?? paths.shield} /></svg>;
}
