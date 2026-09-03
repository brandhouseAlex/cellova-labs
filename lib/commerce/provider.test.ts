import { describe, expect, it } from "vitest";
import { commerceProviders, getCommerceProvider } from "./provider";

describe.skipIf(!process.env.COMMERCE_PROVIDER)("commerce provider configuration", () => {
  it("uses a configured provider supported by the Cellova storefront", () => {
    expect(commerceProviders).toContain(getCommerceProvider());
  });
});
