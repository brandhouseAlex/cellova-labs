import { describe, expect, it } from "vitest";
import { hasApprovedResearchAccess, isPublicInformationRoute, resolveResearchAccess } from "./researchAccess";

describe("Cellova research-gate route rules", () => {
  it("keeps public information and legal pages available without an account", () => {
    expect(isPublicInformationRoute("/about")).toBe(true);
    expect(isPublicInformationRoute("/contact")).toBe(true);
    expect(isPublicInformationRoute("/policies/research-use")).toBe(true);
  });

  it("keeps catalog, cart, checkout, product, and account surfaces gated", () => {
    expect(isPublicInformationRoute("/")).toBe(false);
    expect(isPublicInformationRoute("/products/bpc-157")).toBe(false);
    expect(isPublicInformationRoute("/cart")).toBe(false);
    expect(isPublicInformationRoute("/account")).toBe(false);
  });

  it("requires explicit approval before a research account unlocks the catalog", () => {
    expect(hasApprovedResearchAccess("pending")).toBe(false);
    expect(hasApprovedResearchAccess(undefined)).toBe(false);
    expect(hasApprovedResearchAccess("approved")).toBe(true);
  });

  it("keeps pending accounts behind protected routes while allowing public information", () => {
    expect(resolveResearchAccess("/products", "pending")).toBe("pending");
    expect(resolveResearchAccess("/account/orders", "pending")).toBe("pending");
    expect(resolveResearchAccess("/contact", "pending")).toBe("public");
    expect(resolveResearchAccess("/products", "approved")).toBe("approved");
    expect(resolveResearchAccess("/products", undefined)).toBe("gated");
  });
});
