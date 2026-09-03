import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CollectionDetailContent } from "./CollectionDetailContent";

beforeEach(() => { Object.defineProperty(globalThis, "location", { value: { pathname: "/collections/research-materials" }, configurable: true }); });
afterEach(() => { Reflect.deleteProperty(globalThis, "location"); });

describe("CollectionDetailContent", () => {
  it("renders the approved-access fixture collection and its provider-backed material record", () => {
    const html = renderToStaticMarkup(<CollectionDetailContent collection={{ id: "collection_01", handle: "research-materials", title: "Research Materials", description: "Controlled Cellova research records.", image: null }} products={[{ id: "product_01", handle: "bpc-157", title: "BPC-157", description: "Record", descriptionHtml: "<p>Record</p>", productType: "Research Peptide", vendor: "Cellova Labs", tags: [], images: [], priceRange: { min: { amount: "39.00", currencyCode: "USD" }, max: { amount: "39.00", currencyCode: "USD" } }, options: [], variants: [], lotDocumentation: null, lotDocumentations: [] }]} />);
    expect(html).toContain("Research Materials");
    expect(html).toContain("BPC-157");
    expect(html).toContain("$39.00");
  });
});
