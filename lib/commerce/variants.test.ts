import { describe, expect, it } from "vitest";
import { isDefaultVariantTitle, shouldSuppressDefaultVariantDetails } from "./variants";

describe("variant presentation", () => {
  it("suppresses a single platform-default variant but retains meaningful variant selections", () => {
    expect(isDefaultVariantTitle("Default Title")).toBe(true);
    expect(shouldSuppressDefaultVariantDetails({ variants: [{ title: "Default Title" }] } as never)).toBe(true);
    expect(shouldSuppressDefaultVariantDetails({ variants: [{ title: "10 mg" }] } as never)).toBe(false);
    expect(shouldSuppressDefaultVariantDetails({ variants: [{ title: "5 mg" }, { title: "10 mg" }] } as never)).toBe(false);
  });
});
