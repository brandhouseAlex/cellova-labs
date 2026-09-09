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

  it("does not provide a browser-trusted customer authentication fallback", async () => {
    await expect(mockProvider.login({ email: "researcher@example.com" })).resolves.toMatchObject({ success: false });
    await expect(mockProvider.register({
      firstName: "Research",
      lastName: "User",
      email: "researcher@example.com",
      phone: "+14155552671",
      companyName: "Cellova Test",
      acceptsResearchUseTerms: true,
    })).resolves.toMatchObject({ success: false });
    await expect(mockProvider.getCustomer("mock_session")).resolves.toBeNull();
  });
});
