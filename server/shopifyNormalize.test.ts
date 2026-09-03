import { describe, expect, it } from "vitest";
import { normalizeProduct, type RawProduct } from "./_core/shopifyNormalize";

const baseProduct: RawProduct = {
  id: "gid://shopify/Product/1",
  handle: "cellova-test-material",
  title: "Cellova Test Material",
  description: "Research-use test material.",
  descriptionHtml: "<p>Research-use test material.</p>",
  productType: "Research Material",
  vendor: "Cellova Labs",
  tags: ["research-material"],
  options: [],
  priceRange: {
    minVariantPrice: { amount: "39.00", currencyCode: "USD" },
    maxVariantPrice: { amount: "39.00", currencyCode: "USD" },
  },
  images: { edges: [] },
  variants: {
    edges: [{ node: { id: "gid://shopify/ProductVariant/1", title: "Default Title", availableForSale: true, price: { amount: "39.00", currencyCode: "USD" }, compareAtPrice: null, selectedOptions: [] } }],
  },
  lotNumber: { value: "CLV-2026-001" },
  testedDate: { value: "2026-09-03" },
  laboratory: { value: "Cellova Analytical" },
  identityMs: { value: "Conforms" },
  purityHplc: { value: "99.4%" },
  netContent: { value: "5 mg" },
  endotoxin: { value: "< 0.1 EU/mg" },
  heavyMetals: { value: "< 10 ppm" },
  pdfUrl: { value: "https://example.com/cellova-coa.pdf" },
  status: { value: "available" },
};

describe("Cellova COA normalization", () => {
  it("exposes a completed, approved lot record to storefront consumers", () => {
    const product = normalizeProduct(baseProduct);

    expect(product.lotDocumentation).toEqual({
      lotNumber: "CLV-2026-001",
      testedDate: "2026-09-03",
      laboratory: "Cellova Analytical",
      identityMs: "Conforms",
      purityHplc: "99.4%",
      netContent: "5 mg",
      endotoxin: "< 0.1 EU/mg",
      heavyMetals: "< 10 ppm",
      pdfUrl: "https://example.com/cellova-coa.pdf",
    });
  });

  it("withholds incomplete lot records from the public storefront contract", () => {
    const product = normalizeProduct({
      ...baseProduct,
      heavyMetals: null,
    });

    expect(product.lotDocumentation).toBeNull();
  });

  it("withholds records until Cellova marks the COA available", () => {
    const product = normalizeProduct({
      ...baseProduct,
      status: { value: "draft" },
    });

    expect(product.lotDocumentation).toBeNull();
  });

  it("normalizes and orders all complete published lot records when the provider supplies them", () => {
    const product = normalizeProduct({
      ...baseProduct,
      coaRecords: { value: JSON.stringify([
        { lot_number: "CLV-2026-002", tested_date: "2026-09-04", laboratory: "Cellova Analytical", identity_ms: "Conforms", purity_hplc: "99.5%", net_content: "5 mg", endotoxin: "< 0.1 EU/mg", heavy_metals: "< 10 ppm", pdf: "https://example.com/lot-2.pdf", status: "available" },
        { lot_number: "CLV-DRAFT", tested_date: "2026-09-05", laboratory: "Cellova Analytical", identity_ms: "Conforms", purity_hplc: "99.5%", net_content: "5 mg", endotoxin: "< 0.1 EU/mg", heavy_metals: "< 10 ppm", pdf: "https://example.com/draft.pdf", status: "draft" },
      ]) },
    });

    expect(product.lotDocumentations.map(lot => lot.lotNumber)).toEqual(["CLV-2026-002", "CLV-2026-001"]);
    expect(product.lotDocumentation?.lotNumber).toBe("CLV-2026-002");
  });
});
