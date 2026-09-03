import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ResearchAccessContext, type ResearchAccessContextValue } from "@/contexts/ResearchAccessContext";
import { ResearchGate } from "./ResearchGate";
import { CollectionDetailContent } from "./CollectionDetailContent";

const approvedAccess: ResearchAccessContextValue = {
  account: { firstName: "Approved", lastName: "Researcher", email: "approved@example.com", phone: "555-0100", companyName: "Cellova Research", createdAt: "2026-09-03T00:00:00.000Z", status: "approved" },
  isAuthenticated: true,
  isReady: true,
  register: async () => ({ success: true }),
  login: async () => ({ success: true }),
  logout: () => undefined,
};

beforeEach(() => { Object.defineProperty(globalThis, "location", { value: { pathname: "/collections/research-materials" }, configurable: true }); });
afterEach(() => { Reflect.deleteProperty(globalThis, "location"); });

describe("approved Cellova collection access", () => {
  it("hides the research gate and renders the populated provider collection detail", () => {
    const html = renderToStaticMarkup(<ResearchAccessContext.Provider value={approvedAccess}><ResearchGate /><CollectionDetailContent collection={{ id: "collection_01", handle: "research-materials", title: "Research Materials", description: "Controlled Cellova research records.", image: null }} products={[{ id: "product_01", handle: "bpc-157", title: "BPC-157", description: "Record", descriptionHtml: "<p>Record</p>", productType: "Research Peptide", vendor: "Cellova Labs", tags: [], images: [], priceRange: { min: { amount: "39.00", currencyCode: "USD" }, max: { amount: "39.00", currencyCode: "USD" } }, options: [], variants: [], lotDocumentation: null, lotDocumentations: [] }]} /></ResearchAccessContext.Provider>);
    expect(html).toContain("Research Materials");
    expect(html).toContain("BPC-157");
    expect(html).not.toContain("Registration required");
  });
});
