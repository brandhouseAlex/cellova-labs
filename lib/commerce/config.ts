/**
 * Commerce provider configuration.
 *
 * The active provider is selected with the COMMERCE_PROVIDER environment
 * variable. Supported values: "mock" (default), "medusa", "shopify".
 *
 * NOTE: Only publishable/public keys belong in NEXT_PUBLIC_* variables.
 * Never place private admin tokens in NEXT_PUBLIC_* variables.
 */

export type CommerceProviderName = "mock" | "medusa" | "shopify";

export interface CommerceConfig {
  provider: CommerceProviderName;
  medusa: {
    backendUrl: string | undefined;
    publishableKey: string | undefined;
  };
  shopify: {
    storeDomain: string | undefined;
    storefrontToken: string | undefined;
    apiVersion: string;
    /** Optional namespace for public product COA metafields; defaults to custom. */
    coaMetafieldNamespace: string | undefined;
  };
}

function resolveProvider(): CommerceProviderName {
  const raw = (
    process.env.COMMERCE_PROVIDER ??
    process.env.NEXT_PUBLIC_COMMERCE_PROVIDER ??
    "mock"
  ).toLowerCase();

  if (raw === "medusa" || raw === "shopify" || raw === "mock") {
    return raw;
  }

  // Unknown value — fall back to the mock provider so the storefront
  // always renders, and make the misconfiguration visible in logs.
  console.warn(
    `[commerce] Unknown COMMERCE_PROVIDER="${raw}". Falling back to "mock".`
  );
  return "mock";
}

export const commerceConfig: CommerceConfig = {
  provider: resolveProvider(),
  medusa: {
    backendUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
    publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  },
  shopify: {
    storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
    storefrontToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
    apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION ?? "2025-01",
    coaMetafieldNamespace: process.env.NEXT_PUBLIC_SHOPIFY_COA_METAFIELD_NAMESPACE,
  },
};

/** Base URL of the deployed site, used for canonical URLs and sitemaps. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteName = "Cellova Labs";
