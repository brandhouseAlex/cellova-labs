import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createBrowserOrder } from "@/lib/browserRecords";
import { FunctionalOrderDetailPage, FunctionalOrdersPage } from "./FunctionalFlowPages";

const store = new Map<string, string>();
const localStorageMock = { getItem: (key: string) => store.get(key) ?? null, setItem: (key: string, value: string) => { store.set(key, value); }, removeItem: (key: string) => { store.delete(key); }, clear: () => { store.clear(); }, key: () => null, get length() { return store.size; } };

beforeEach(() => { store.clear(); Object.defineProperty(globalThis, "location", { value: { pathname: "/account/orders" }, configurable: true }); Object.defineProperty(globalThis, "window", { value: { localStorage: localStorageMock, location: globalThis.location }, configurable: true }); });
afterEach(() => { Reflect.deleteProperty(globalThis, "window"); Reflect.deleteProperty(globalThis, "location"); });

describe("FunctionalOrdersPage", () => {
  it("renders a prepared browser-record research order in history", () => {
    const order = createBrowserOrder({ id: "cart_01", checkoutUrl: "", items: [{ lineId: "line_01", variantId: "variant_01", productHandle: "material", productTitle: "Cellova Material", variantTitle: "5 mg", image: null, unitPrice: { amount: "39.00", currencyCode: "USD" }, quantity: 1, lineTotal: { amount: "39.00", currencyCode: "USD" } }], itemCount: 1, subtotal: { amount: "39.00", currencyCode: "USD" }, total: { amount: "39.00", currencyCode: "USD" } }, { name: "Researcher One", email: "researcher@example.com", address: "1 Lab Way", city: "Austin", state: "TX", postalCode: "78701" });
    const html = renderToStaticMarkup(<FunctionalOrdersPage />);
    expect(html).toContain(order.id);
    expect(html).toContain("Prepared");
    expect(html).toContain("$39.00");
  });

  it("renders the prepared order detail with its material and delivery record", () => {
    const order = createBrowserOrder({ id: "cart_02", checkoutUrl: "", items: [{ lineId: "line_02", variantId: "variant_02", productHandle: "material", productTitle: "Cellova Material", variantTitle: "10 mg", image: null, unitPrice: { amount: "59.00", currencyCode: "USD" }, quantity: 2, lineTotal: { amount: "118.00", currencyCode: "USD" } }], itemCount: 2, subtotal: { amount: "118.00", currencyCode: "USD" }, total: { amount: "118.00", currencyCode: "USD" } }, { name: "Researcher One", email: "researcher@example.com", address: "1 Lab Way", city: "Austin", state: "TX", postalCode: "78701" });
    globalThis.location.pathname = `/account/orders/${order.id}`;
    const html = renderToStaticMarkup(<FunctionalOrderDetailPage />);
    expect(html).toContain(order.id);
    expect(html).toContain("Cellova Material");
    expect(html).toContain("Researcher One");
    expect(html).toContain("$118.00");
  });
});
