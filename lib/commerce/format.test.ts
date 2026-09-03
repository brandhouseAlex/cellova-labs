import { describe, expect, it } from "vitest";
import { formatMoney, priceLabel } from "./format";

describe("commerce display formatting", () => {
  it("formats normalized money without float precision display artifacts", () => {
    expect(formatMoney({ amount: "39.00", currencyCode: "USD" })).toBe("$39.00");
  });

  it("uses a concise range label only when variant prices differ", () => {
    expect(priceLabel({ min: { amount: "39.00", currencyCode: "USD" }, max: { amount: "39.00", currencyCode: "USD" } })).toBe("$39.00");
    expect(priceLabel({ min: { amount: "39.00", currencyCode: "USD" }, max: { amount: "49.00", currencyCode: "USD" } })).toBe("From $39.00");
  });
});
