import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getCommerceProvider, getCommerceProviderName } from "./provider";

const fetchMock = vi.fn();

describe("commerce provider selection", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    process.env.SHOPIFY_STORE_DOMAIN = "test.myshopify.com";
    process.env.SHOPIFY_STOREFRONT_API_ACCESS_TOKEN = "test-token";
    process.env.MEDUSA_BACKEND_URL = "https://medusa.test";
    process.env.MEDUSA_PUBLISHABLE_KEY = "pk_test_cellova";
    process.env.MEDUSA_REGION_ID = "reg_test";
    process.env.MEDUSA_CURRENCY_CODE = "usd";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.COMMERCE_PROVIDER;
    delete process.env.MEDUSA_BACKEND_URL;
    delete process.env.MEDUSA_PUBLISHABLE_KEY;
    delete process.env.MEDUSA_REGION_ID;
    delete process.env.MEDUSA_CURRENCY_CODE;
  });

  it("defaults to Shopify to preserve existing deployments", () => {
    expect(getCommerceProviderName()).toBe("shopify");
    expect(getCommerceProvider().name).toBe("shopify");
  });

  it("selects Medusa and normalizes Store API product data into the shared storefront shape", async () => {
    process.env.COMMERCE_PROVIDER = "medusa";
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        products: [{
          id: "prod_01",
          handle: "cellova-material",
          title: "Cellova Material",
          description: "Independent catalog record.",
          thumbnail: "https://images.example/cellova.png",
          tags: [{ value: "research-material" }],
          options: [{ title: "Format", values: [{ value: "5 mg" }] }],
          variants: [{
            id: "variant_01",
            title: "5 mg",
            manage_inventory: false,
            calculated_price: { calculated_amount: 3900, currency_code: "usd" },
            options: [{ value: "5 mg", option: { title: "Format" } }],
          }],
        }],
      }),
    } as Response);

    const products = await getCommerceProvider().listProducts({ first: 12 });

    expect(getCommerceProviderName()).toBe("medusa");
    expect(products[0]).toMatchObject({
      handle: "cellova-material",
      title: "Cellova Material",
      priceRange: { min: { amount: "39.00", currencyCode: "USD" } },
      variants: [{ id: "variant_01", availableForSale: true }],
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://medusa.test/store/products?limit=12&region_id=reg_test",
      expect.objectContaining({ headers: expect.objectContaining({ "x-publishable-api-key": "pk_test_cellova" }) })
    );
  });

  it("rejects unsupported provider names before any provider call", () => {
    process.env.COMMERCE_PROVIDER = "unknown";
    expect(() => getCommerceProvider()).toThrow("COMMERCE_PROVIDER must be either 'shopify' or 'medusa'");
  });
});
