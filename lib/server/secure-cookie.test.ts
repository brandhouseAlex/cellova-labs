import { beforeEach, describe, expect, it } from "vitest";
import { COOKIE_MAX_AGE, sealCookie, unsealCookie } from "@/lib/server/secure-cookie";

describe("secure cookie envelopes", () => {
  beforeEach(() => {
    process.env.CELLOVA_SESSION_SECRET = "a-test-only-secret-that-is-long-enough-to-derive-a-key";
  });

  it("encrypts OAuth PKCE data and rejects a tampered envelope", async () => {
    const sealed = await sealCookie({ kind: "oauth", state: "state", nonce: "nonce", verifier: "verifier", email: "researcher@example.com", returnTo: "/products" }, COOKIE_MAX_AGE.oauth);
    expect(sealed).not.toContain("verifier");
    await expect(unsealCookie(sealed, "oauth")).resolves.toMatchObject({ email: "researcher@example.com", verifier: "verifier" });
    await expect(unsealCookie(`${sealed}x`, "oauth")).resolves.toBeNull();
  });

  it("does not accept a session envelope as an OAuth transaction", async () => {
    const sealed = await sealCookie({ kind: "session", customerId: "gid://shopify/Customer/1", email: "researcher@example.com", idToken: "id-token" }, COOKIE_MAX_AGE.session);
    await expect(unsealCookie(sealed, "oauth")).resolves.toBeNull();
  });
});
