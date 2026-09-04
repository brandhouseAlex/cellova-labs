"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { CommerceCertificateOfAnalysis, CommerceProduct } from "@/lib/commerce/types";
import { cn } from "@/lib/utils";

type CoaRecord = {
  product: CommerceProduct;
  coa: CommerceCertificateOfAnalysis;
  index: number;
};

/**
 * Client-side filtering for server-fetched provider data. Every complete COA
 * is listed individually; no batch record is synthesized in the storefront.
 */
export function CoaLibrary({ products }: { products: CommerceProduct[] }) {
  const [query, setQuery] = useState("");
  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const eligible = products.flatMap((product) =>
      completeCoas(product).map((coa, index) => ({ product, coa, index }))
    );
    if (!normalized) return eligible;

    return eligible.filter(({ product, coa }) =>
      product.title.toLowerCase().includes(normalized) || (coa.lotNumber ?? "").toLowerCase().includes(normalized)
    );
  }, [products, query]);

  return (
    <div>
      <label htmlFor="coa-search" className="sr-only">Search product name or lot number</label>
      <div className="relative max-w-xl">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-silver" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input id="coa-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by product name or lot number" className="w-full rounded-[7px] border border-line bg-paper py-3.5 pl-12 pr-4 text-sm text-ink outline-none transition-all placeholder:text-silver focus:border-brand focus:ring-4 focus:ring-brand/10" />
      </div>

      {filteredRecords.length ? (
        <>
          <div className="mt-8 hidden overflow-hidden rounded-[12px] border border-line bg-paper shadow-[0_18px_46px_-40px_rgba(32,32,32,0.45)] lg:block">
            <table className="w-full table-fixed text-left">
              <colgroup><col className="w-[18%]" /><col className="w-[8%]" /><col className="w-[9%]" /><col className="w-[9%]" /><col className="w-[9%]" /><col className="w-[10%]" /><col className="w-[9%]" /><col className="w-[8%]" /><col className="w-[8%]" /><col className="w-[12%]" /></colgroup>
              <thead className="bg-mist text-[9px] font-semibold uppercase tracking-[0.1em] text-slate"><tr>{["Product", "Lot Number", "Tested Date", "Laboratory", "Identity (MS)", "Purity (HPLC)", "Net Content", "Endotoxin", "Heavy Metals", "COA"].map((heading) => <th key={heading} scope="col" className="break-words px-2.5 py-4 first:pl-5">{heading}</th>)}</tr></thead>
              <tbody className="divide-y divide-line">{filteredRecords.map((record) => <CoaTableRow key={recordKey(record)} {...record} />)}</tbody>
            </table>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:hidden">{filteredRecords.map((record) => <CoaMobileCard key={recordKey(record)} {...record} />)}</div>
        </>
      ) : (
        <div className="mt-8 rounded-[10px] border border-dashed border-brand/35 bg-brand-tint/25 px-6 py-14 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-deep">Batch record status · no published records</p>
          <p className="mt-3 font-display text-xl font-semibold text-ink">No complete COA records match that search</p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate">Only active-provider products with fully assigned batch, laboratory, identity, purity, net-content, endotoxin, and heavy-metal fields appear in this library.</p>
        </div>
      )}
    </div>
  );
}

function CoaTableRow({ product, coa }: CoaRecord) {
  const values = [coa.lotNumber, coa.testedDate, coa.laboratory, coa.identityMs, coa.purityHplc, coa.netContent, coa.endotoxin, coa.heavyMetals];
  return <tr className="align-top transition-colors hover:bg-brand-tint/25"><td className="min-w-0 px-2.5 py-4 pl-5"><ProductIdentity product={product} /><span className="mt-2 inline-flex rounded-full bg-brand-tint px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-brand-deep">Available</span></td>{values.map((value, index) => <td key={index} className="min-w-0 break-words px-2.5 py-4 text-xs leading-5 text-ink"><MetadataValue value={value} /></td>)}<td className="min-w-0 px-2.5 py-4 pr-5"><PdfControl href={coa.pdfUrl} compact /></td></tr>;
}

function CoaMobileCard({ product, coa }: CoaRecord) {
  const fields = [["Lot Number", coa.lotNumber], ["Tested Date", coa.testedDate], ["Laboratory", coa.laboratory], ["Identity (MS)", coa.identityMs], ["Purity (HPLC)", coa.purityHplc], ["Net Content", coa.netContent], ["Endotoxin", coa.endotoxin], ["Heavy Metals", coa.heavyMetals]] as const;
  return <article className="rounded-[12px] border border-line bg-paper p-5 shadow-[0_18px_46px_-40px_rgba(32,32,32,0.45)] transition-colors hover:border-brand/35"><div className="flex items-start justify-between gap-4"><ProductIdentity product={product} /><span className="shrink-0 rounded-full bg-brand-tint px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-deep">Available</span></div><dl className="mt-5 grid grid-cols-[minmax(0,.78fr)_minmax(0,1.22fr)] gap-x-5 gap-y-3 border-t border-line pt-5">{fields.map(([label, value]) => <div key={label} className="contents"><dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate">{label}</dt><dd className="min-w-0 break-words text-sm font-medium leading-5 text-ink"><MetadataValue value={value} /></dd></div>)}</dl><div className="mt-5"><PdfControl href={coa.pdfUrl} /></div></article>;
}

function ProductIdentity({ product }: { product: CommerceProduct }) {
  return <Link href={`/products/${product.handle}`} className="group flex min-w-0 items-center gap-3"><span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[6px] bg-mist">{product.featuredImage ? <Image src={product.featuredImage.url} alt="" fill sizes="44px" className="object-contain p-1" /> : null}</span><span className="min-w-0"><span className="block break-words text-sm font-semibold leading-4 text-ink transition-colors group-hover:text-brand-deep">{product.title}</span><span className="mt-0.5 block text-xs text-slate">View product details</span></span></Link>;
}

function MetadataValue({ value }: { value: string | undefined | null }) {
  return value ? <span>{value}</span> : <span className="text-silver">Not yet assigned</span>;
}

function PdfControl({ href, compact = false }: { href: string | undefined | null; compact?: boolean }) {
  if (!href) return null;
  return <span className={cn("flex flex-wrap", compact ? "gap-1.5" : "gap-2")}><a href={href} target="_blank" rel="noreferrer" className={cn("inline-flex items-center justify-center rounded-[6px] bg-brand font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:bg-brand-deep", compact ? "w-full px-2 py-2 text-[9px]" : "whitespace-nowrap px-3 py-2 text-[10px] tracking-[0.12em]")}>View PDF <span className="ml-1">↗</span></a><a href={href} download className={cn("inline-flex items-center justify-center rounded-[6px] border border-brand/45 font-semibold uppercase tracking-[0.1em] text-brand-deep transition-colors hover:bg-brand-tint", compact ? "w-full px-2 py-2 text-[9px]" : "whitespace-nowrap px-3 py-2 text-[10px] tracking-[0.12em]")}>Download <span className="ml-1">↓</span></a></span>;
}

function completeCoas(product: CommerceProduct): CommerceCertificateOfAnalysis[] {
  const source = [...(product.coas ?? []), ...(product.coa ? [product.coa] : [])];
  return source.filter(isCompleteCoa).filter((coa, index, all) => all.findIndex((candidate) => candidate.lotNumber === coa.lotNumber && candidate.pdfUrl === coa.pdfUrl) === index);
}

function recordKey({ product, coa, index }: CoaRecord) {
  return `${product.id}-${coa.lotNumber}-${coa.pdfUrl ?? "coa"}-${index}`;
}

function isCompleteCoa(coa: CommerceProduct["coa"] | undefined): coa is CommerceCertificateOfAnalysis {
  return Boolean(coa && [coa.productName, coa.lotNumber, coa.testedDate, coa.laboratory, coa.identityMs, coa.purityHplc, coa.netContent, coa.endotoxin, coa.heavyMetals].every((value) => value?.trim()));
}
