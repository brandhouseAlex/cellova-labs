import { describe, expect, it } from "vitest";
import { canSubmitGate, isPublicGateRoute } from "./gate-policy";

describe("Cellova research gate policy", () => {
  it("keeps catalog, product, collection, account, and COA routes protected", () => {
    expect(isPublicGateRoute("/")).toBe(false);
    expect(isPublicGateRoute("/products/bpc-157-10mg")).toBe(false);
    expect(isPublicGateRoute("/collections/research-peptides")).toBe(false);
    expect(isPublicGateRoute("/account")).toBe(false);
    expect(isPublicGateRoute("/coa-library")).toBe(false);
  });

  it("leaves only approved informational routes outside the gate", () => {
    expect(isPublicGateRoute("/about")).toBe(true);
    expect(isPublicGateRoute("/contact")).toBe(true);
    expect(isPublicGateRoute("/policies/privacy")).toBe(true);
  });

  it("requires explicit consent for account creation while retaining login behaviour", () => {
    expect(canSubmitGate("login", false, false)).toBe(true);
    expect(canSubmitGate("register", false, false)).toBe(false);
    expect(canSubmitGate("register", true, false)).toBe(true);
    expect(canSubmitGate("login", true, true)).toBe(false);
  });
});
