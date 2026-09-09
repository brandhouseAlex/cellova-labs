import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ findEligibleCustomerByEmail: vi.fn(), findEligibleCustomerById: vi.fn() }));

vi.mock("@/lib/server/registration-service", () => ({
  findEligibleCustomerByEmail: mocks.findEligibleCustomerByEmail,
  findEligibleCustomerById: mocks.findEligibleCustomerById,
}));

import { startCustomerAccountAuthorization } from "@/lib/server/customer-account";

describe("Customer Account authorization start", () => {
  beforeEach(() => {
    process.env.SHOPIFY_STORE_DOMAIN = "cellova-labs-w5v5hxfa";
    process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID = "public-client";
    process.env.CELLOVA_SESSION_SECRET = "test-only-cookie-secret-that-is-long-enough-for-encryption";
    mocks.findEligibleCustomerByEmail.mockResolvedValue({
      id: "gid://shopify/Customer/1",
      email: "researcher@example.com",
      firstName: "Researcher",
      lastName: "Example",
      phone: null,
      createdAt: "2026-01-01T00:00:00.000Z",
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      authorization_endpoint: "https://accounts.shopify.com/oauth/authorize",
      token_endpoint: "https://accounts.shopify.com/oauth/token",
      end_session_endpoint: "https://accounts.shopify.com/logout",
      jwks_uri: "https://accounts.shopify.com/jwks",
      issuer: "https://accounts.shopify.com",
    }), { status: 200, headers: { "content-type": "application/json" } })));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("uses the verified normalized email as a login hint while preserving PKCE parameters", async () => {
    const result = await startCustomerAccountAuthorization("  RESEARCHER@EXAMPLE.COM  ", "/products/aod-9604");
    const url = new URL(result.authorizationUrl);

    expect(mocks.findEligibleCustomerByEmail).toHaveBeenCalledWith("  RESEARCHER@EXAMPLE.COM  ");
    expect(url.searchParams.get("login_hint")).toBe("researcher@example.com");
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("redirect_uri")).toBe("https://www.cellovalabs.com/customer-account-api/callback");
    expect(url.searchParams.get("state")).toBeTruthy();
    expect(url.searchParams.get("nonce")).toBeTruthy();
  });
});
