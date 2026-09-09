import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchCustomerRegistrationDefinition } from "@/lib/server/shopify-admin-definition";

const originalEnvironment = {
  clientId: process.env.SHOPIFY_ADMIN_CLIENT_ID,
  clientSecret: process.env.SHOPIFY_ADMIN_CLIENT_SECRET,
  shop: process.env.SHOPIFY_ADMIN_SHOP,
};

afterEach(() => {
  process.env.SHOPIFY_ADMIN_CLIENT_ID = originalEnvironment.clientId;
  process.env.SHOPIFY_ADMIN_CLIENT_SECRET = originalEnvironment.clientSecret;
  process.env.SHOPIFY_ADMIN_SHOP = originalEnvironment.shop;
  vi.unstubAllGlobals();
});

describe("fetchCustomerRegistrationDefinition", () => {
  it("returns only the permitted definition type and field metadata", async () => {
    process.env.SHOPIFY_ADMIN_CLIENT_ID = "test-client-id";
    process.env.SHOPIFY_ADMIN_CLIENT_SECRET = "test-client-secret";
    process.env.SHOPIFY_ADMIN_SHOP = "cellova-test";

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "test-admin-token" }), { status: 200 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              metaobjectDefinitionByType: {
                type: "customer_registration",
                fieldDefinitions: [
                  { key: "business_name", name: "Business Name", type: { name: "single_line_text_field" } },
                  { key: "age_research_consent", name: "Age & Research Consent", type: { name: "boolean" } },
                ],
              },
            },
          }),
          { status: 200 }
        )
      );

    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchCustomerRegistrationDefinition()).resolves.toEqual({
      type: "customer_registration",
      fields: [
        { key: "business_name", name: "Business Name", type: "single_line_text_field" },
        { key: "age_research_consent", name: "Age & Research Consent", type: "boolean" },
      ],
    });
    expect(String(fetchMock.mock.calls[0][0])).toContain("cellova-test.myshopify.com/admin/oauth/access_token");
    expect(String(fetchMock.mock.calls[1][0])).toContain("cellova-test.myshopify.com/admin/api/2026-07/graphql.json");
  });

  it("reports a sanitized token-grant failure without exposing the upstream body", async () => {
    process.env.SHOPIFY_ADMIN_CLIENT_ID = "test-client-id";
    process.env.SHOPIFY_ADMIN_CLIENT_SECRET = "test-client-secret";
    process.env.SHOPIFY_ADMIN_SHOP = "cellova-test";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ detail: "private" }), { status: 401 })));

    await expect(fetchCustomerRegistrationDefinition()).rejects.toMatchObject({ code: "token_grant" });
  });
});
