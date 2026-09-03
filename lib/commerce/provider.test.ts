import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { commerceProviders, getCommerceProvider } from "./provider";

describe("commerce provider configuration", () => {
  beforeEach(() => vi.stubEnv("CELLOVA_COMMERCE_PROVIDER", "shopify"));
  afterEach(() => vi.unstubAllEnvs());

  it("uses a configured provider supported by the Cellova storefront", () => {
    expect(commerceProviders).toContain(getCommerceProvider());
  });

  it("does not read the inherited generic provider selector", () => {
    vi.stubEnv("COMMERCE_PROVIDER", "medusa");
    expect(getCommerceProvider()).toBe("shopify");
  });
});
