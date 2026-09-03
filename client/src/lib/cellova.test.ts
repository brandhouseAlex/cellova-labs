import { describe, expect, it } from "vitest";
import { CELLLOVA_SITE, formatMoney } from "./cellova";

describe("Cellova storefront configuration", () => {
  it("uses the official customer-facing brand name", () => {
    expect(CELLLOVA_SITE.name).toBe("Cellova Labs");
  });

  it("formats product prices through the shared storefront formatter", () => {
    expect(formatMoney("39.00", "USD")).toBe("$39.00");
  });

  it("keeps canonical origin unset until the separate Cellova deployment config supplies it", () => {
    expect(CELLLOVA_SITE.url).toBe("");
  });
});
