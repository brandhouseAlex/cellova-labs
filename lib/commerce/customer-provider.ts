import "server-only";

import type { CustomerProfile, CustomerRegistration } from "./types";
import { CommerceError } from "./types";
import { getCommerceProvider } from "./provider";

export type CustomerCommerceAdapter = {
  register: (registration: CustomerRegistration) => Promise<{ accessToken: string; expiresAt: string }>;
  signIn: (email: string, password: string) => Promise<{ accessToken: string; expiresAt: string }>;
  getCurrentCustomer: (accessToken: string) => Promise<CustomerProfile | null>;
  signOut: (accessToken: string) => Promise<void>;
};

const medusaCustomerAdapter: CustomerCommerceAdapter = {
  register: async () => { throw new CommerceError("The selected customer service is not configured. Please contact Cellova Labs support.", "configuration"); },
  signIn: async () => { throw new CommerceError("The selected customer service is not configured. Please contact Cellova Labs support.", "configuration"); },
  getCurrentCustomer: async () => { throw new CommerceError("The selected customer service is not configured. Please contact Cellova Labs support.", "configuration"); },
  signOut: async () => undefined,
};

export async function getCustomerCommerceAdapter(): Promise<CustomerCommerceAdapter> {
  if (getCommerceProvider() === "shopify") {
    const shopify = await import("./shopify/customer");
    return { register: shopify.registerCustomer, signIn: shopify.signInCustomer, getCurrentCustomer: shopify.getCurrentCustomer, signOut: shopify.signOutCustomer };
  }
  return medusaCustomerAdapter;
}
