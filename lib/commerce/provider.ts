export const commerceProviders = ["shopify", "medusa"] as const;
export type CommerceProviderName = (typeof commerceProviders)[number];

export function getCommerceProvider(): CommerceProviderName {
  const configured = process.env.COMMERCE_PROVIDER;
  if (configured === "shopify" || configured === "medusa") return configured;
  throw new Error("COMMERCE_PROVIDER must be set to either shopify or medusa.");
}

export async function getCommerceAdapter() {
  const provider = getCommerceProvider();
  if (provider === "shopify") return (await import("./shopify/adapter")).shopifyAdapter;
  return (await import("./medusa/adapter")).medusaAdapter;
}
