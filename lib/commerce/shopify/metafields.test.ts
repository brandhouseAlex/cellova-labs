import { describe, expect, it } from "vitest";
import { configuredProductMetafields, customerMetafieldMap, hasCompleteCustomerConsentMapping, productMetafieldMap } from "./metafields";

describe("centralized Shopify metadata mapping", () => {
  it("does not invent a product metafield namespace or key", () => {
    expect(Object.values(productMetafieldMap).every((field) => field === null || Boolean(field.namespace && field.key))).toBe(true);
    expect(configuredProductMetafields().every((field) => Boolean(field.namespace && field.key))).toBe(true);
  });

  it("requires every customer consent field to be configured before durable registration metadata is written", () => {
    expect(typeof hasCompleteCustomerConsentMapping()).toBe("boolean");
    expect(Object.keys(customerMetafieldMap)).toHaveLength(6);
  });
});
