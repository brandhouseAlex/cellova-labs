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

  return <section className="mt-14 overflow-hidden rounded-[10px] border border-[#D8DCE3] bg-paper shadow-[0_12px_24px_-25px_rgba(18,20,28,.18)]" aria-label="Product information">
    <div className="space-y-5 p-4 md:hidden sm:p-5">
      {hasCoa ? <CertificateOfAnalysis coas={coas} /> : null}
      <StorageInstructions product={product} />
      <FdaDisclosure />
    </div>
    <div className="hidden md:block">
    <div className="grid grid-cols-3 divide-x divide-[#D8DCE3] border-b border-[#D8DCE3]" role="tablist" aria-label="Product documentation tabs">
      {tabs.map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={active === id} onClick={() => setActive(id)} className={cn("flex min-h-16 items-center justify-center gap-3 border-b-2 px-4 py-4 text-center text-sm font-semibold uppercase tracking-[-.01em] transition-colors", active === id ? "border-[#F2A63C] text-[#2D3452]" : "border-transparent text-[#2D3452] hover:bg-[#F7F7F4]")}>{id === "coa" ? <CertificateIcon className={cn("h-7 w-7", active === id ? "text-[#F2A63C]" : "text-[#2D3452]")} /> : id === "storage" ? <ColdStorageIcon className="h-7 w-7 text-[#2D3452]" /> : <DisclosureIcon className="h-7 w-7 text-[#2D3452]" />}{label}</button>)}
    </div>
    <div className="p-5 lg:p-6">
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
  const batchFields = [["Product Name", coa?.productName], ["Lot Number", coa?.lotNumber], ["Tested Date", coa?.testedDate], ["Laboratory", coa?.laboratory], ["Identity (MS)", coa?.identityMs]] as const;
  const results = [["Purity (HPLC)", "RP-HPLC (214 nm)", coa?.purityHplc], ["Net Content", "HPLC Quantitation", coa?.netContent], ["Endotoxin", "<USP85>", coa?.endotoxin], ["Heavy Metals", "<USP232>", coa?.heavyMetals]] as const;

  return <div className="space-y-4">
    {coas.length > 1 ? <label className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-end"><span className="font-semibold text-[#2D3452]">Select lot</span><select value={selectedLot} onChange={(event) => setSelectedLot(Number(event.target.value))} className="rounded-[6px] border border-[#D8DCE3] bg-paper px-3 py-2 text-sm text-[#2D3452] outline-none focus:border-[#8B93A7]">{coas.map((record, index) => <option key={`${record.lotNumber ?? "coa"}-${index}`} value={index}>{record.lotNumber ?? `COA ${index + 1}`}{record.testedDate ? ` — ${record.testedDate}` : ""}</option>)}</select></label> : null}
    <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
      <section className="rounded-[9px] border border-[#E2E5EA] bg-paper p-5 sm:p-6" aria-labelledby="batch-information-heading">
        <h3 id="batch-information-heading" className="text-xl font-semibold uppercase tracking-[-.025em] text-[#2D3452]">Batch Information</h3>
        <dl className="mt-4 overflow-hidden rounded-[6px] border border-[#E2E5EA]">{batchFields.map(([label, value]) => <div key={label} className="grid grid-cols-[minmax(8.5rem,1.05fr)_minmax(0,.95fr)] border-b border-[#E2E5EA] text-sm last:border-b-0"><dt className="bg-[#FAFAF9] px-4 py-2.5 font-medium text-[#2D3452]">{label}</dt><dd className="min-w-0 break-words border-l border-[#E2E5EA] px-4 py-2.5 text-[#2D3452]">{value || "Not provided"}</dd></div>)}</dl>
        <p className="mt-5 text-sm leading-5 text-[#69738B]">All results are from third-party testing.<br />COA available for each lot.</p>
      </section>
      <section className="rounded-[9px] border border-[#E2E5EA] bg-paper p-5 sm:p-6" aria-labelledby="analytical-results-heading">
        <h3 id="analytical-results-heading" className="text-xl font-semibold uppercase tracking-[-.025em] text-[#F2A63C]">Analytical Results</h3>
        <div className="mt-4 overflow-x-auto rounded-[6px] border border-[#E2E5EA]"><table className="w-full min-w-[430px] border-collapse text-left text-sm"><thead className="bg-[#FAFAF9] text-xs font-medium uppercase tracking-[.04em] text-[#69738B]"><tr><th className="border-r border-[#E2E5EA] px-4 py-2.5">Test</th><th className="border-r border-[#E2E5EA] px-4 py-2.5">Method</th><th className="px-4 py-2.5">Result</th></tr></thead><tbody>{results.map(([test, method, result]) => <tr key={test} className="border-t border-[#E2E5EA]"><th scope="row" className="border-r border-[#E2E5EA] px-4 py-2.5 font-medium text-[#2D3452]">{test}</th><td className="border-r border-[#E2E5EA] px-4 py-2.5 text-[#2D3452]">{method}</td><td className="px-4 py-2.5 text-[#2D3452]">{result || "Not provided"}</td></tr>)}</tbody></table></div>
        {coa?.pdfUrl ? <a href={coa.pdfUrl} target="_blank" rel="noreferrer" download className="mt-5 flex min-h-14 items-center justify-center gap-4 rounded-[6px] border border-[#2D3452] bg-[#2D3452] px-5 text-sm font-semibold uppercase tracking-[.02em] text-white transition-colors hover:bg-[#202743] hover:text-white"><DownloadIcon className="h-6 w-6" />Download COA</a> : null}
      </section>
    </div>
  </div>;
}

function StorageInstructions({ product }: { product: CommerceProduct }) {
  const guidelines = ["Keep peptides cold and away from light once received.", "For short-term use (days to weeks), refrigeration at 4°C (39°F) is acceptable.", "Lyophilized peptides are typically stable at room temperature for several weeks, making it suitable for moderate-term storage."];
  return <div className="rounded-[9px] border border-[#E2E5EA] bg-paper p-7 sm:p-9"><div className="border-l-2 border-brand pl-4 sm:pl-5"><h3 className="font-display text-2xl font-semibold text-ink">Handling and Storage Tips</h3></div>{product.specs?.storage ? <p className="mt-6 rounded-[8px] border border-brand/20 bg-brand-tint/55 px-4 py-3.5 text-sm leading-6 text-ink"><strong className="font-semibold">Product storage record:</strong> {product.specs.storage}</p> : null}<ol className="mt-7 max-w-3xl space-y-4 text-sm leading-7 text-slate">{guidelines.map((guideline, index) => <li key={guideline} className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-start gap-3"><span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-brand/25 bg-paper text-[10px] font-semibold text-brand-deep">0{index + 1}</span><span className="min-w-0 pt-0.5">{guideline}</span></li>)}</ol></div>;
}

function FdaDisclosure() {
  return <div className="rounded-[9px] border border-[#E2E5EA] bg-paper p-7 sm:p-9"><div className="border-l-2 border-brand pl-4 sm:pl-5"><h3 className="font-display text-2xl font-semibold text-ink">FDA Disclosure & Intended Use</h3><p className="mt-3 max-w-2xl text-sm leading-6 text-slate">Important research-use information for this product category.</p></div><div className="mt-7 max-w-3xl space-y-5 text-sm leading-7 text-slate"><section className="border-t border-brand/20 pt-5"><h4 className="font-semibold text-ink">FDA Disclosure</h4><p className="mt-3">The statements on this website and the products sold herein have not been evaluated by the U.S. Food and Drug Administration (FDA). These products are not intended to diagnose, treat, cure, or prevent any disease. Products sold are for Research Use Only and are not for human or animal use.</p></section><section className="border-t border-brand/20 pt-5"><h4 className="font-semibold text-ink">Intended Purpose</h4><p className="mt-3">Products sold on this site are intended for laboratory research use only, specifically <em>in vitro</em> studies – experiments conducted outside of living organisms.</p></section></div></div>;
}

function DownloadIcon({ className }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" /></svg>; }
function CertificateIcon({ className }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M6 2h8l4 4v16H6z" /><path d="M14 2v5h5M8.5 16h7M8.5 12.5h7" /></svg>; }
function ColdStorageIcon({ className }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M5 10h14M9 6h.01M9 14h.01M15 14h.01M12 17v2" /></svg>; }
function DisclosureIcon({ className }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M6 2h8l4 4v16H6z" /><path d="M14 2v5h5M8.5 12.5h7M8.5 16h7" /></svg>; }
