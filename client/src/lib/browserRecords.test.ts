import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createBrowserOrder, getBrowserOrder, listBrowserOrders, saveBrowserInquiry } from "./browserRecords";

const store = new Map<string, string>();
const localStorageMock = { getItem: (key: string) => store.get(key) ?? null, setItem: (key: string, value: string) => { store.set(key, value); }, removeItem: (key: string) => { store.delete(key); }, clear: () => { store.clear(); }, key: () => null, get length() { return store.size; } };

beforeEach(() => { store.clear(); Object.defineProperty(globalThis, "window", { value: { localStorage: localStorageMock }, configurable: true }); });
afterEach(() => { Reflect.deleteProperty(globalThis, "window"); });

describe("Cellova browser records", () => {
  it("persists a prepared research order and retrieves its full local record", () => {
    const order = createBrowserOrder({ id: "cart_01", checkoutUrl: "", items: [{ lineId: "line_01", variantId: "variant_01", productHandle: "material", productTitle: "Cellova Material", variantTitle: "5 mg", image: null, unitPrice: { amount: "39.00", currencyCode: "USD" }, quantity: 1, lineTotal: { amount: "39.00", currencyCode: "USD" } }], itemCount: 1, subtotal: { amount: "39.00", currencyCode: "USD" }, total: { amount: "39.00", currencyCode: "USD" } }, { name: "Researcher One", email: "researcher@example.com", address: "1 Lab Way", city: "Austin", state: "TX", postalCode: "78701" });
    expect(listBrowserOrders()).toHaveLength(1);
    expect(getBrowserOrder(order.id)).toMatchObject({ id: order.id, status: "prepared", customer: { email: "researcher@example.com" } });
  });

  it("persists a contact inquiry with a Cellova reference identifier", () => {
    const inquiry = saveBrowserInquiry({ name: "Researcher One", email: "researcher@example.com", topic: "catalog", message: "Requesting a record." });
    expect(inquiry.id).toMatch(/^INQ-/);
  });
});
