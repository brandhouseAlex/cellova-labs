"use client";

import { useMemo, useState } from "react";
import type { CommerceCertificateOfAnalysis, CommerceProduct } from "@/lib/commerce/types";
import { cn } from "@/lib/utils";

/** PDP style: clinical documentation dossier driven solely by normalized provider data. */
type Tab = "coa" | "storage" | "disclosure";

function sortCoas(product: CommerceProduct) {
  const source = product.coas?.length ? product.coas : product.coa ? [product.coa] : [];
  return [...source].sort((a, b) => (b.testedDate ? Date.parse(b.testedDate) : Number.NEGATIVE_INFINITY) - (a.testedDate ? Date.parse(a.testedDate) : Number.NEGATIVE_INFINITY));
}

export function ProductInformationTabs({ product }: { product: CommerceProduct }) {
  const coas = useMemo(() => sortCoas(product), [product]);
  const hasCoa = coas.length > 0;
  const [active, setActive] = useState<Tab>(hasCoa ? "coa" : "storage");
  const tabs: Array<[Tab, string]> = hasCoa
    ? [["coa", "Certificate of Analysis"], ["storage", "Storage Instructions"], ["disclosure", "FDA Disclosure & Intended Use"]]
    : [["storage", "Storage Instructions"], ["disclosure", "FDA Disclosure & Intended Use"]];

  return <section className="mt-14" aria-label="Product information">
    <div className="space-y-5 md:hidden">
      {hasCoa ? <CertificateOfAnalysis coas={coas} /> : null}
      <StorageInstructions product={product} />
      <FdaDisclosure />
    </div>
    <div className="hidden md:block">
    <div className="flex overflow-x-auto border-b border-line px-1" role="tablist" aria-label="Product documentation tabs">
      {tabs.map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={active === id} onClick={() => setActive(id)} className={cn("shrink-0 border-b-2 px-4 py-4 text-sm font-medium transition-colors sm:px-7", active === id ? "border-brand text-ink" : "border-transparent text-slate hover:text-ink")}>{label}</button>)}
    </div>
    <div className="pt-7">
      {active === "coa" && hasCoa ? <CertificateOfAnalysis coas={coas} /> : null}
      {active === "storage" ? <StorageInstructions product={product} /> : null}
      {active === "disclosure" ? <FdaDisclosure /> : null}
    </div>
    </div>
  </section>;
}

function CertificateOfAnalysis({ coas }: { coas: CommerceCertificateOfAnalysis[] }) {
  const [selectedLot, setSelectedLot] = useState(0);
  const coa = coas[selectedLot] ?? coas[0];
  const batchFields = [["Product Name", coa?.productName], ["Lot Number", coa?.lotNumber], ["Tested Date", coa?.testedDate], ["Laboratory", coa?.laboratory]] as const;
  const results = [["Identity (MS)", coa?.identityMs, "LC-MS/MS"], ["Purity (HPLC)", coa?.purityHplc, "RP-HPLC (214nm)"], ["Net Content", coa?.netContent, "HPLC Quantitation"], ["Endotoxin", coa?.endotoxin, "<USP85>"], ["Heavy Metals", coa?.heavyMetals, "<USP232>"]] as const;

  return <div className="grid gap-5 lg:grid-cols-[0.56fr_1fr] lg:gap-6">
    <aside className="rounded-[12px] border border-[#D8DCE3] bg-gradient-to-br from-paper via-[#F7F7F4] to-[#FFF1DB] p-5 shadow-[0_16px_32px_-26px_rgba(32,32,32,0.35)] sm:p-7">
      <ShieldCheck className="h-10 w-10 text-brand-deep" />
      <h3 className="mt-6 font-display text-xl font-semibold text-ink">Certificate of Analysis</h3>
      <p className="mt-3 text-sm leading-6 text-slate">Each assigned batch is accompanied by the laboratory information available through the active product record.</p>
      {coa?.pdfUrl ? <a href={coa.pdfUrl} target="_blank" rel="noreferrer" download className="mt-8 flex items-center justify-between gap-3 rounded-[8px] border border-[#8B93A7] bg-paper px-4 py-3 text-left shadow-[0_10px_22px_-20px_rgba(32,32,32,0.4)] transition-colors hover:bg-brand-tint"><span className="flex min-w-0 items-center gap-3"><PdfIcon className="h-7 w-7 shrink-0 text-brand-deep" /><span className="min-w-0"><span className="block text-sm font-semibold text-ink">Download Full COA</span><span className="mt-0.5 block truncate text-xs text-slate">{coa.pdfName ?? "Download file"}</span></span></span><DownloadIcon className="h-5 w-5 shrink-0 text-brand-deep" /></a> : null}
    </aside>
    <div className="space-y-5">
      {coas.length > 1 ? <label className="flex flex-col gap-2 rounded-[10px] border border-line bg-paper px-4 py-3.5 text-sm shadow-[0_12px_24px_-25px_rgba(32,32,32,0.35)] sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5"><span className="font-semibold text-ink">Select lot</span><select value={selectedLot} onChange={(event) => setSelectedLot(Number(event.target.value))} className="w-full rounded-[8px] border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-brand sm:w-auto">{coas.map((record, index) => <option key={`${record.lotNumber ?? "coa"}-${index}`} value={index}>{record.lotNumber ?? `COA ${index + 1}`}{record.testedDate ? ` — ${record.testedDate}` : ""}</option>)}</select></label> : null}
      <section className="overflow-hidden rounded-[12px] border border-[#D8DCE3] bg-paper shadow-[0_16px_32px_-26px_rgba(32,32,32,0.32)]" aria-labelledby="batch-information-heading">
        <h3 id="batch-information-heading" className="border-b border-[#D8DCE3] bg-[#FFF1DB] px-5 py-4 text-sm font-semibold text-brand-deep">Batch Information</h3>
        <dl className="divide-y divide-[#D8DCE3]">{batchFields.map(([label, value]) => <div key={label} className="grid gap-1 px-5 py-3 text-sm sm:grid-cols-[minmax(9rem,0.45fr)_1fr] sm:gap-5"><dt className="font-semibold text-ink">{label}</dt><dd className="min-w-0 break-words text-slate">{value || "Not provided"}</dd></div>)}</dl>
      </section>
      <section className="overflow-hidden rounded-[12px] border border-[#D8DCE3] bg-paper shadow-[0_16px_32px_-26px_rgba(32,32,32,0.32)]" aria-labelledby="analytical-results-heading">
        <h3 id="analytical-results-heading" className="border-b border-[#D8DCE3] bg-[#FFF1DB] px-5 py-4 text-sm font-semibold text-brand-deep">Analytical Results</h3>
        <dl className="divide-y divide-[#D8DCE3] sm:hidden">{results.map(([test, result, method]) => <div key={test} className="px-5 py-3.5"><dt className="font-semibold text-ink">{test}</dt><dd className="mt-1 text-sm text-slate">{result || "Not provided"}</dd><dd className="mt-1 text-xs text-silver">{method}</dd></div>)}</dl><div className="hidden overflow-x-auto sm:block"><table className="w-full min-w-[570px] text-left text-sm"><thead className="bg-ink text-[10px] font-semibold uppercase tracking-[0.14em] text-paper"><tr><th className="px-5 py-3.5">Test</th><th className="px-5 py-3.5">Result</th><th className="px-5 py-3.5">Method</th></tr></thead><tbody className="divide-y divide-[#D8DCE3]">{results.map(([test, result, method]) => <tr key={test}><th scope="row" className="px-5 py-3.5 font-semibold text-ink">{test}</th><td className="px-5 py-3.5 text-slate">{result || "Not provided"}</td><td className="px-5 py-3.5 text-slate">{method}</td></tr>)}</tbody></table></div>
      </section>
    </div>
  </div>;
}

function StorageInstructions({ product }: { product: CommerceProduct }) {
  const guidelines = ["Keep peptides cold and away from light once received.", "For short-term use (days to weeks), refrigeration at 4°C (39°F) is acceptable.", "Lyophilized peptides are typically stable at room temperature for several weeks, making it suitable for moderate-term storage."];
  return <div className="rounded-[12px] border border-line bg-gradient-to-br from-brand-tint/55 via-paper to-mist p-7 shadow-[0_16px_32px_-28px_rgba(32,32,32,0.36)] sm:p-9"><div className="border-l-2 border-brand pl-4 sm:pl-5"><h3 className="font-display text-2xl font-semibold text-ink">Handling and Storage Tips</h3></div>{product.specs?.storage ? <p className="mt-6 rounded-[8px] border border-brand/20 bg-brand-tint/55 px-4 py-3.5 text-sm leading-6 text-ink"><strong className="font-semibold">Product storage record:</strong> {product.specs.storage}</p> : null}<ol className="mt-7 max-w-3xl space-y-4 text-sm leading-7 text-slate">{guidelines.map((guideline, index) => <li key={guideline} className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-start gap-3"><span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-brand/25 bg-paper text-[10px] font-semibold text-brand-deep">0{index + 1}</span><span className="min-w-0 pt-0.5">{guideline}</span></li>)}</ol></div>;
}

function FdaDisclosure() {
  return <div className="rounded-[12px] border border-line bg-gradient-to-br from-brand-tint/55 via-paper to-mist p-7 shadow-[0_16px_32px_-28px_rgba(32,32,32,0.36)] sm:p-9"><div className="border-l-2 border-brand pl-4 sm:pl-5"><h3 className="font-display text-2xl font-semibold text-ink">FDA Disclosure & Intended Use</h3><p className="mt-3 max-w-2xl text-sm leading-6 text-slate">Important research-use information for this product category.</p></div><div className="mt-7 max-w-3xl space-y-5 text-sm leading-7 text-slate"><section className="border-t border-brand/20 pt-5"><h4 className="font-semibold text-ink">FDA Disclosure</h4><p className="mt-3">The statements on this website and the products sold herein have not been evaluated by the U.S. Food and Drug Administration (FDA). These products are not intended to diagnose, treat, cure, or prevent any disease. Products sold are for Research Use Only and are not for human or animal use.</p></section><section className="border-t border-brand/20 pt-5"><h4 className="font-semibold text-ink">Intended Purpose</h4><p className="mt-3">Products sold on this site are intended for laboratory research use only, specifically <em>in vitro</em> studies – experiments conducted outside of living organisms.</p></section></div></div>;
}

function ShieldCheck({ className }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M12 3 19 6v5c0 4.4-3 8.4-7 10-4-1.6-7-5.6-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" /></svg>; }
function PdfIcon({ className }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M6 2h8l4 4v16H6z" /><path d="M14 2v5h5M8.5 16h7M8.5 12.5h7" /></svg>; }
function DownloadIcon({ className }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" /></svg>; }
