import type { Cart } from "@shared/commerce/types";

const ORDERS_KEY = "cellova.research-orders";
const INQUIRIES_KEY = "cellova.contact-inquiries";

export type BrowserOrder = {
  id: string;
  createdAt: string;
  status: "prepared";
  customer: { name: string; email: string; address: string; city: string; state: string; postalCode: string };
  items: Cart["items"];
  subtotal: Cart["subtotal"];
  total: Cart["total"];
};

function read<T>(key: string): T[] {
  try { return JSON.parse(window.localStorage.getItem(key) ?? "[]") as T[]; } catch { return []; }
}
function write<T>(key: string, records: T[]) { window.localStorage.setItem(key, JSON.stringify(records)); }

export function listBrowserOrders(): BrowserOrder[] {
  if (typeof window === "undefined") return [];
  return read<BrowserOrder>(ORDERS_KEY).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getBrowserOrder(id: string): BrowserOrder | null {
  return listBrowserOrders().find(order => order.id === id) ?? null;
}

export function createBrowserOrder(cart: Cart, customer: BrowserOrder["customer"]): BrowserOrder {
  const order: BrowserOrder = { id: `CLV-${Date.now().toString(36).toUpperCase()}`, createdAt: new Date().toISOString(), status: "prepared", customer, items: cart.items, subtotal: cart.subtotal, total: cart.total };
  write(ORDERS_KEY, [order, ...listBrowserOrders()]);
  return order;
}

export function saveBrowserInquiry(input: { name: string; email: string; topic: string; message: string }) {
  const inquiry = { id: `INQ-${Date.now().toString(36).toUpperCase()}`, createdAt: new Date().toISOString(), ...input };
  write(INQUIRIES_KEY, [inquiry, ...read<typeof inquiry>(INQUIRIES_KEY)]);
  return inquiry;
}
