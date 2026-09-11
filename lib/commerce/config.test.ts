import { afterEach, describe, expect, it, vi } from "vitest";

const originalEnvironment = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnvironment };
  vi.resetModules();
});

describe("commerce configuration", () => {
  it("selects Shopify in browser bundles when its public Storefront settings are present", async () => {
    delete process.env.COMMERCE_PROVIDER;
    delete process.env.NEXT_PUBLIC_COMMERCE_PROVIDER;
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN = "cellova-labs-w5v5hxfa.myshopify.com";
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN = "public-storefront-token";

    const { commerceConfig } = await import("@/lib/commerce/config");
    expect(commerceConfig.provider).toBe("shopify");
  });
});
