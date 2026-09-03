"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/auth-store";
import { canSubmitGate, isPublicGateRoute } from "@/lib/auth/gate-policy";
import { cn } from "@/lib/utils";
import { ResearchOrbit } from "@/components/gate/research-orbit";

/**
 * Global Cellova catalog gate. The presentation is intentionally separate from
 * the provider-backed auth actions so login, registration, consent capture,
 * session persistence, and protected-route behaviour remain unchanged.
 */
export function ResearchGate() {
  const { isAuthenticated, login, register } = useAuth();
  const pathname = usePathname();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [acknowledged, setAcknowledged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const informationalRoute = isPublicGateRoute(pathname);
  const visible = !isAuthenticated && !informationalRoute;
  const isRegister = mode === "register";

  useEffect(() => {
    if (!visible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
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
      const result = isRegister
        ? await register({
            firstName: String(form.get("firstName") ?? "").trim(),
            lastName: String(form.get("lastName") ?? "").trim(),
            email,
            phone: String(form.get("phone") ?? "").trim(),
            companyName: String(form.get("companyName") ?? "").trim(),
            password,
            acceptsResearchUseTerms: acknowledged,
            researchUseConsentVersion: "research-network-v1.0",
          })
        : await login({ email, password });

      if (!result.success) setError(result.error ?? "We could not complete that request. Please try again.");
      else if (!remember) {
        // Preserve the current provider-session behaviour; remember-me is a
        // presentation choice until the active customer provider owns it.
      }
    } catch {
      setError("A connection error occurred. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function selectMode(next: "login" | "register") {
    setMode(next);
    setError(null);
    setShowPassword(false);
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="research-gate-title" className="gate-shell fixed inset-0 z-[90] overflow-y-auto bg-[#12141C]">
      <div className="gate-layout grid min-h-[100svh] lg:grid-cols-[53.6%_46.4%]">
        <section className="gate-right order-1 flex min-h-[100svh] items-center bg-[#F3F4F1] px-5 py-10 sm:px-10 lg:order-2 lg:px-[clamp(3.5rem,3.8vw,5rem)]">
          <div className="gate-form-panel w-full max-w-[34.5rem] animate-gate-panel-enter">
            <p className="gate-eyebrow flex items-center gap-2"><GateIcon name="lock" className="h-4 w-4" /> Private catalog access</p>
            <h1 id="research-gate-title" className="mt-7 font-display text-[clamp(2rem,2.1vw,2.05rem)] font-bold leading-[1.08] tracking-[-0.055em] text-ink">
              {isRegister ? "Join the Cellova Research Community" : "Welcome Back to Cellova Labs"}
            </h1>
            <p className="mt-4 max-w-[29rem] text-[15px] leading-7 text-slate">
              {isRegister
                ? "Create your account to access our curated catalog of research-grade peptides and compounds."
                : "Sign in to access your account and explore our curated catalog of research-grade peptides and compounds."}
            </p>

            <div role="tablist" aria-label="Cellova account access" className="gate-segmented mt-6 grid grid-cols-2 rounded-[7px] border border-line bg-white/55 p-1">
              <button type="button" role="tab" aria-selected={!isRegister} onClick={() => selectMode("login")} className={cn("gate-segmented__button", !isRegister && "gate-segmented__button--active")}>
                <GateIcon name="user" className="h-5 w-5" /> Log In
              </button>
              <button type="button" role="tab" aria-selected={isRegister} onClick={() => selectMode("register")} className={cn("gate-segmented__button", isRegister && "gate-segmented__button--active")}>
                <GateIcon name="userPlus" className="h-5 w-5" /> Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="gate-form mt-7" key={mode}>
              {isRegister ? <div className="grid gap-5 sm:grid-cols-2">
                <GateField label="First name" name="firstName" autoComplete="given-name" required />
                <GateField label="Last name" name="lastName" autoComplete="family-name" required />
                <GateField label="Phone number" name="phone" type="tel" autoComplete="tel" placeholder="+1 555 000 0000" required />
                <GateField label="Company name" name="companyName" autoComplete="organization" required />
              </div> : null}

              <GateField label="Email address" name="email" type="email" autoComplete="email" placeholder="Enter your email address" icon="mail" required />
              <GateField label="Password" name="password" type={showPassword ? "text" : "password"} autoComplete={isRegister ? "new-password" : "current-password"} minLength={isRegister ? 8 : 6} placeholder="Enter your password" icon="lock" required endAdornment={
                <button type="button" onClick={() => setShowPassword((current) => !current)} className="gate-password-toggle" aria-label={showPassword ? "Hide password" : "Show password"}>
                  <GateIcon name={showPassword ? "eyeOff" : "eye"} className="h-5 w-5" />
                </button>
              } />

              {!isRegister ? <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex cursor-pointer items-center gap-2.5 text-slate"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="gate-checkbox h-[18px] w-[18px]" /> Remember me</label>
                <Link href="/contact" className="font-medium text-brand-deep transition-colors hover:text-brand">Forgot password?</Link>
              </div> : null}

              {error ? <p role="alert" className="rounded-[7px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
              <button type="submit" disabled={!canSubmitGate(mode, acknowledged, busy)} className="gate-submit gate-submit--primary w-full rounded-[7px] px-5 py-[1.1rem] text-sm font-bold uppercase tracking-[0.04em] text-[#12141C] disabled:cursor-not-allowed disabled:opacity-45">
                {busy ? "Please wait…" : isRegister ? "Create Your Research Account  →" : "Log In to Your Account  →"}
              </button>

              <label htmlFor="gate-consent" className="gate-consent flex cursor-pointer items-start gap-4 rounded-[7px] border border-line bg-white/45 px-4 py-4 text-sm leading-6 text-slate">
                <input id="gate-consent" type="checkbox" checked={acknowledged} onChange={(event) => setAcknowledged(event.target.checked)} className="gate-checkbox mt-0.5 h-5 w-5 shrink-0" />
                <span>I confirm that I am 21 years of age or older and that all products are intended strictly for research purposes.</span>
              </label>
            </form>

            <nav aria-label="Policies" className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate">
              <Link href="/policies/terms" className="transition-colors hover:text-ink">Terms of Use</Link>
              <span aria-hidden="true" className="text-line">|</span>
              <Link href="/policies/privacy" className="transition-colors hover:text-ink">Privacy Policy</Link>
              <span aria-hidden="true" className="text-line">|</span>
              <Link href="/policies/research-use" className="transition-colors hover:text-ink">Research Use Policy</Link>
            </nav>
          </div>
        </section>

        <section className="gate-left order-2 relative isolate flex min-h-[670px] overflow-hidden bg-[#12141C] px-6 py-9 text-paper sm:px-10 sm:py-12 lg:order-1 lg:min-h-[100svh] lg:px-[clamp(3.5rem,4.25vw,4.5rem)] lg:py-[clamp(3.5rem,6.2vh,4.5rem)]">
          <div className="grid-texture pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <ResearchOrbit />
          <div className="relative z-10 flex w-full flex-col animate-gate-enter">
            <div className="relative h-[3.9rem] w-[14.5rem] sm:h-[4.2rem] sm:w-[15.5rem]">
              <Image src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663938836977/GMzYeVeHFFlNlfwo.webp" alt="Cellova Labs" fill priority sizes="280px" className="object-contain object-left" />
            </div>
            <div className="mt-16 max-w-[21rem] lg:mt-[clamp(4.7rem,9.2vh,6.7rem)]">
              <p className="gate-eyebrow gate-eyebrow--dark flex items-center gap-2"><GateIcon name="shield" className="h-4 w-4" /> Research access only</p>
              <h2 className="mt-7 font-display text-[clamp(3.2rem,3.35vw,3.65rem)] font-bold leading-[0.98] tracking-[-0.065em] text-paper">
                Join the<br />Cellova<br />Research<br /><span className="text-brand">Community.</span>
              </h2>
              <span className="mt-7 block h-px w-12 bg-brand" />
              <p className="mt-6 max-w-[22rem] text-[15px] leading-7 text-[#D8DCE3] sm:text-base">Access a curated research catalog with organized documentation, lot-specific testing, and resources built for research.</p>
            </div>
            <div className="mt-auto pt-10 lg:mt-12 lg:max-w-[36rem] lg:pt-0"><CredentialGrid /></div>
            <p className="gate-community-note mt-9 flex max-w-[31rem] items-start gap-3 border-t border-white/15 pt-6 text-sm leading-6 text-[#D8DCE3] lg:max-w-[36rem]"><GateIcon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-brand" />A research-focused community built around clarity, documentation, and quality.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

function GateField({ label, icon, endAdornment, ...input }: { label: string; name: string; type?: string; autoComplete?: string; placeholder?: string; minLength?: number; required?: boolean; icon?: string; endAdornment?: ReactNode }) {
  return <label className="block"><span className="mb-3.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink">{label}</span><span className="gate-input-shell flex items-center gap-3 rounded-[7px] border border-line bg-white px-4 py-[1.2rem] transition-all duration-200">{icon ? <GateIcon name={icon} className="h-5 w-5 shrink-0 text-silver" /> : null}<input {...input} className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-silver" />{endAdornment}</span></label>;
}

function CredentialGrid() {
  const credentials = [
    ["doc", "COA by lot", "Documentation with every batch"],
    ["badge", "Third-party tested", "Tested for quality"],
    ["flag", "USA manufactured", "Proudly made in the United States"],
    ["flask", "Research use only", "For research purposes only"],
  ] as const;
  return <div className="grid grid-cols-2 border-y border-white/15 lg:grid-cols-4">{credentials.map(([icon, title, description], index) => <div key={title} className={cn("min-h-[145px] px-3 py-5 sm:px-4", index % 2 === 0 && "border-r border-white/15 lg:border-r-0", index < 2 && "border-b border-white/15 lg:border-b-0", index < 3 && "lg:border-r lg:border-white/15")}><GateIcon name={icon} className="h-8 w-8 text-brand" /><p className="mt-5 text-[11px] font-bold uppercase leading-5 tracking-[0.08em] text-paper">{title}</p><p className="mt-2 text-xs leading-5 text-[#D8DCE3]">{description}</p></div>)}</div>;
}

function GateIcon({ name, className }: { name: string; className?: string }) {
  const paths: Record<string, string> = {
    shield: "M12 3l7 3v5c0 4.4-3 8.4-7 10-4-1.6-7-5.6-7-10V6l7-3z M9 12l2 2 4-4",
    lock: "M6 11V8a6 6 0 1 1 12 0v3M5 11h14v10H5z",
    mail: "M3 5h18v14H3zM3 7l9 6 9-6",
    eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    eyeOff: "M3 3l18 18M10.6 5.7A9.5 9.5 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17.5 17.5 0 0 1-3.2 3.8M6.2 6.2A17.6 17.6 0 0 0 2.5 12S6 18.5 12 18.5c1.3 0 2.5-.3 3.5-.8M9.9 9.9a3 3 0 0 0 4.2 4.2",
    flask: "M9 3h6M10 3v6L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3M7.5 14h9",
    badge: "M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM8.5 13.5L7 22l5-3 5 3-1.5-8.5",
    doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h5M10 17h5",
    flag: "M5 21V4m0 1c4-3 7 3 14 0v10c-7 3-10-3-14 0",
    user: "M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    userPlus: "M16 21a6 6 0 0 0-12 0M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6m-3-3h6",
  };
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] ?? paths.shield} /></svg>;
}
