import { useState } from "react";
import { Download, FileText, ThermometerSun } from "lucide-react";
import type { Product } from "@shared/commerce/types";
import { LotDocumentationPanel } from "./LotDocumentationPanel";

type Tab = "coa" | "storage" | "disclosure";

export function ProductInformationTabs({ product }: { product: Product }) {
  const coas = product.lotDocumentations.length ? product.lotDocumentations : product.lotDocumentation ? [product.lotDocumentation] : [];
  const hasCoa = coas.length > 0;
  const [active, setActive] = useState<Tab>(hasCoa ? "coa" : "storage");
  const [selectedLot, setSelectedLot] = useState(0);
  const coa = coas[selectedLot] ?? coas[0];
  const tabs: Array<[Tab, string]> = hasCoa ? [["coa", "Certificate of Analysis"], ["storage", "Storage instructions"], ["disclosure", "Research-use disclosure"]] : [["storage", "Storage instructions"], ["disclosure", "Research-use disclosure"]];
  return <section className="product-tabs" aria-label="Product information"><div role="tablist" className="product-tabs__nav">{tabs.map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={active === id} className={active === id ? "is-active" : ""} onClick={() => setActive(id)}>{label}</button>)}</div><div className="product-tabs__body">{active === "coa" && coa ? <div className="product-tabs__coa"><aside><FileText size={34} /><p className="eyebrow eyebrow--spark">CERTIFICATE OF ANALYSIS</p><h3>Lot-level documentation</h3><p>Each published record is attached to its Cellova product and available analytical information.</p><a className="button button--spark" href={coa.pdfUrl} target="_blank" rel="noreferrer">Download full COA <Download size={16} /></a></aside><div>{coas.length > 1 && <label className="lot-selector">Select lot<select value={selectedLot} onChange={event => setSelectedLot(Number(event.target.value))}>{coas.map((record, index) => <option key={record.lotNumber} value={index}>{record.lotNumber} — {record.testedDate}</option>)}</select></label>}<LotDocumentationPanel lot={coa} /></div></div> : null}{active === "storage" ? <article className="product-tabs__information"><ThermometerSun size={34} /><p className="eyebrow eyebrow--spark">HANDLING AND STORAGE</p><h3>Maintain the product record.</h3><ol><li>Keep research materials protected from heat, moisture, and direct light.</li><li>Review the specific product record and certificate of analysis before storage or handling.</li><li>Maintain all materials only within an appropriate research environment.</li></ol></article> : null}{active === "disclosure" ? <article className="product-tabs__information"><FileText size={34} /><p className="eyebrow eyebrow--spark">INTENDED USE</p><h3>Research use only.</h3><p>Materials described in this catalog are provided for lawful laboratory research. They are not intended to diagnose, treat, cure, or prevent disease, and are not for human or veterinary use.</p><p>Review the product record, documentation, and Cellova research-use policy before ordering.</p></article> : null}</div></section>;
}
