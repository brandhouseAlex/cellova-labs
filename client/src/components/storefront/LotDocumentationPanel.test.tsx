import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { describe, expect, it } from "vitest";
import { LotDocumentationPanel } from "./LotDocumentationPanel";

const lot = {
  lotNumber: "CLV-2026-001",
  testedDate: "2026-09-03",
  laboratory: "Cellova Analytical",
  identityMs: "Conforms",
  purityHplc: "99.4%",
  netContent: "5 mg",
  endotoxin: "< 0.1 EU/mg",
  heavyMetals: "< 10 ppm",
  pdfUrl: "https://example.com/cellova-coa.pdf",
};

describe("LotDocumentationPanel", () => {
  it("renders the complete Cellova COA record with its source PDF", () => {
    const html = renderToStaticMarkup(<LotDocumentationPanel lot={lot} />);

    expect(html).toContain("Lot CLV-2026-001");
    expect(html).toContain("Cellova Analytical");
    expect(html).toContain("Purity (HPLC)");
    expect(html).toContain("https://example.com/cellova-coa.pdf");
    expect(html).toContain("Source PDF");
  });
});
