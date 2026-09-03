import { commerceConfig } from "./config";
import type { CommerceProvider } from "./types";
import { mockProvider } from "./providers/mock";
import { medusaProvider } from "./providers/medusa";
import { shopifyProvider } from "./providers/shopify";

/**
 * The single commerce entry point for the entire storefront.
 *
 * UI components import `commerce` from here and call the normalized
 * interface — they never import provider SDKs directly. Switching
 * backends is a one-line environment change (COMMERCE_PROVIDER).
 */
function resolveProvider(): CommerceProvider {
  switch (commerceConfig.provider) {
    case "medusa":
      return medusaProvider;
    case "shopify":
      return shopifyProvider;
    case "mock":
    default:
      return mockProvider;
  }
}

export const commerce: CommerceProvider = resolveProvider();

export * from "./types";
export { commerceConfig, siteUrl, siteName } from "./config";
