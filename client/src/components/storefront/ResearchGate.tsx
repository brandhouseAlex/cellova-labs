import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, FlaskConical, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useResearchAccess } from "@/contexts/ResearchAccessContext";
import { resolveResearchAccess } from "@/lib/researchAccess";

export function ResearchGate() {
  const [location] = useLocation();
  const { account, isAuthenticated, isReady, login, register, logout } = useResearchAccess();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [acknowledged, setAcknowledged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const accessDecision = resolveResearchAccess(location, account?.status);
  const visible = isReady && !isAuthenticated && accessDecision !== "public";

  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [visible]);

  if (!visible) return null;

  if (accessDecision === "pending" && account) {
    return <div className="research-gate" role="dialog" aria-modal="true" aria-labelledby="research-gate-title"><div className="research-gate__shell"><section className="research-gate__identity"><div className="research-gate__signal" aria-hidden="true" /><img src="/manus-storage/cellova-labs-wordmark_9400de77.webp" alt="Cellova Labs" /><div className="research-gate__intro"><p className="eyebrow eyebrow--spark"><ShieldCheck size={15} /> RESEARCH USE ONLY</p><h1>Research<br /><em>access</em><br />under review.</h1><p>Your Cellova research-account request has been saved to this browser and remains pending approval.</p></div></section><section className="research-gate__form-panel research-gate__pending"><p className="eyebrow eyebrow--spark"><LockKeyhole size={15} /> ACCOUNT STATUS</p><ShieldCheck size={38} /><h2 id="research-gate-title">Request received.</h2><p>Catalog access remains restricted until this research account is marked approved in the selected production customer system.</p><dl><div><dt>Account</dt><dd>{account.email}</dd></div><div><dt>Status</dt><dd>Pending review</dd></div></dl><button className="button button--ink" onClick={logout}>Use a different account</button><Link className="text-link" href="/contact">Contact Cellova support <ArrowRight size={16} /></Link></section></div></div>;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null); setBusy(true);
    const form = new FormData(event.currentTarget);
    const common = { email: String(form.get("email") ?? ""), password: String(form.get("password") ?? "") };
    const result = mode === "login"
      ? await login(common)
      : await register({ ...common, firstName: String(form.get("firstName") ?? ""), lastName: String(form.get("lastName") ?? ""), phone: String(form.get("phone") ?? ""), companyName: String(form.get("companyName") ?? ""), acceptsResearchUseTerms: acknowledged });
    if (!result.success) setError(result.error ?? "We could not complete that request.");
    setBusy(false);
  }

  return <div className="research-gate" role="dialog" aria-modal="true" aria-labelledby="research-gate-title"><div className="research-gate__shell"><section className="research-gate__identity"><div className="research-gate__signal" aria-hidden="true" /><img src="/manus-storage/cellova-labs-wordmark_9400de77.webp" alt="Cellova Labs" /><div className="research-gate__intro"><p className="eyebrow eyebrow--spark"><ShieldCheck size={15} /> RESEARCH USE ONLY</p><h1>Join the<br /><em>Cellova</em><br />Research Network.</h1><p>Access a controlled catalog of research materials with organized documentation and lot-level records.</p></div><div className="research-gate__credential-grid"><span><FlaskConical size={18} />Research material records</span><span><ShieldCheck size={18} />Documentation-led catalog</span><span><LockKeyhole size={18} />Controlled ordering</span></div></section><section className="research-gate__form-panel"><p className="eyebrow eyebrow--spark"><LockKeyhole size={15} /> REGISTRATION REQUIRED</p><h2 id="research-gate-title">Welcome to Cellova Labs</h2><p>Log in or create a research account to continue to the catalog.</p><label className="research-gate__consent"><input type="checkbox" checked={acknowledged} onChange={event => setAcknowledged(event.target.checked)} /><span>By proceeding, I confirm I am authorized to access research-use materials and will use the catalog for lawful research purposes.</span></label><div className="research-gate__tabs" role="tablist"><button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "is-active" : ""} onClick={() => { setMode("login"); setError(null); }}>Log in</button><button type="button" role="tab" aria-selected={mode === "register"} className={mode === "register" ? "is-active" : ""} onClick={() => { setMode("register"); setError(null); }}>Create account</button></div><form onSubmit={submit} className="research-gate__form">{mode === "register" && <><div className="form-split"><GateField label="First name" name="firstName" autoComplete="given-name" /><GateField label="Last name" name="lastName" autoComplete="family-name" /></div><div className="form-split"><GateField label="Phone number" name="phone" type="tel" autoComplete="tel" /><GateField label="Company or affiliation" name="companyName" autoComplete="organization" /></div></>}<GateField label="Email address" name="email" type="email" autoComplete="email" /><label><span>Password</span><div className="research-gate__password"><input name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} required /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(value => !value)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>{mode === "login" && <p className="research-gate__help">New to Cellova? Select <strong>Create account</strong> to request gated catalog access.</p>}{error && <p className="research-gate__error" role="alert">{error}</p>}<button type="submit" className="button button--spark button--wide" disabled={busy || (mode === "register" && !acknowledged)}>{busy ? "Please wait…" : mode === "login" ? "Log in to your account" : "Create research account"}<ArrowRight size={16} /></button></form><div className="research-gate__footer-note"><ShieldCheck size={17} /> Research materials are not for human or veterinary use.</div><nav><Link href="/policies/terms">Terms</Link><Link href="/policies/privacy">Privacy</Link><Link href="/policies/research-use">Research use</Link><Link href="/contact">Contact</Link></nav></section></div></div>;
}

function GateField({ label, name, type = "text", autoComplete }: { label: string; name: string; type?: string; autoComplete?: string }) {
  return <label><span>{label}</span><input name={name} type={type} autoComplete={autoComplete} required /></label>;
}
