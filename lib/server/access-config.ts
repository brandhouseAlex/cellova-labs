const productionOrigin = "https://www.cellovalabs.com";

function normaliseHost(value: string | undefined): string | null {
  if (!value) return null;
  const host = value.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");
  if (!host) return null;
  return host.endsWith(".myshopify.com") ? host : `${host}.myshopify.com`;
}

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new AccessConfigurationError(`${name} is not configured`);
  return value;
}

export class AccessConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AccessConfigurationError";
  }
}

export const ACCESS_PATH = "/access";
export const CUSTOMER_ACCOUNT_CALLBACK_PATH = "/customer-account-api/callback";
export const CUSTOMER_ACCOUNT_LOGOUT_PATH = "/access";
export const ADMIN_API_VERSION = "2026-07";

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function canonicalOrigin(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || productionOrigin;
}

export function customerAccountCallbackUrl(): string {
  return `${productionOrigin}${CUSTOMER_ACCOUNT_CALLBACK_PATH}`;
}

export function customerAccountLogoutUrl(): string {
  return `${productionOrigin}${CUSTOMER_ACCOUNT_LOGOUT_PATH}`;
}

export function storefrontHost(): string {
  return normaliseHost(
    process.env.SHOPIFY_STORE_DOMAIN ?? process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? process.env.SHOPIFY_ADMIN_SHOP
  ) ?? required("SHOPIFY_STORE_DOMAIN");
}

export function adminShopHost(): string {
  return normaliseHost(process.env.SHOPIFY_ADMIN_SHOP ?? process.env.SHOPIFY_STORE_DOMAIN) ?? required("SHOPIFY_ADMIN_SHOP");
}

export function adminCredentials(): { clientId: string; clientSecret: string } {
  return {
    clientId: required("SHOPIFY_ADMIN_CLIENT_ID"),
    clientSecret: required("SHOPIFY_ADMIN_CLIENT_SECRET"),
  };
}

export function customerAccountClientId(): string {
  return required("NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID");
}

export function sessionSecret(): string {
  return required("CELLOVA_SESSION_SECRET");
}

export function sanitiseReturnPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/access")) return "/";
  return value;
}
