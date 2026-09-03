/** Visual style: a compact technical dossier that appears only for complete, approved lots. */
import { FileText } from "lucide-react";
import React from "react";
import type { LotDocumentation } from "@shared/commerce/types";

export function LotDocumentationPanel({ lot }: { lot: LotDocumentation }) {
  return (
    <section className="lot-documentation" aria-labelledby="lot-documentation-title">
      <div className="lot-documentation__heading">
        <div>
          <p className="eyebrow eyebrow--spark">LOT DOCUMENTATION</p>
          <h2 id="lot-documentation-title">Lot {lot.lotNumber}</h2>
        </div>
        <a href={lot.pdfUrl} target="_blank" rel="noreferrer" className="coa-pdf-link">Source PDF <FileText size={15} /></a>
      </div>
      <dl>
        <div><dt>Tested date</dt><dd>{lot.testedDate}</dd></div>
        <div><dt>Laboratory</dt><dd>{lot.laboratory}</dd></div>
        <div><dt>Identity (MS)</dt><dd>{lot.identityMs}</dd></div>
        <div><dt>Purity (HPLC)</dt><dd>{lot.purityHplc}</dd></div>
        <div><dt>Net content</dt><dd>{lot.netContent}</dd></div>
        <div><dt>Endotoxin</dt><dd>{lot.endotoxin}</dd></div>
        <div><dt>Heavy metals</dt><dd>{lot.heavyMetals}</dd></div>
      </dl>
    </section>
  );
}
