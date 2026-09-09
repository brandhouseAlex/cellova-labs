import { describe, expect, it } from "vitest";
import { mockProvider } from "./index";

describe("mockProvider variant media", () => {
  it("returns provider-shaped media for every selectable variant", async () => {
    const product = await mockProvider.getProductByHandle("bacteriostatic-water");

    expect(product).toBeTruthy();
    expect(product?.variants).toHaveLength(2);
    expect(product?.variants.every((variant) => Boolean(variant.image?.url))).toBe(true);
    expect(product?.variants[0]?.image?.url).toBe(product?.featuredImage?.url);
    expect(product?.featuredImage?.url).toMatch(/^https:\/\/files\.manuscdn\.com\//);
  });
});
