import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroAssuranceStrip, HeroProductImage } from "./page";

describe("HeroProductImage", () => {
  it("renders the supplied Cellova product visual as an accessible responsive hero image", () => {
    render(<HeroProductImage />);

    const image = screen.getByRole("img", { name: "Cellova Labs research product lineup" });
    expect(image.getAttribute("src")).toContain("soQIwZUdfXIdMSCv.png");
    expect(image.getAttribute("class")).toContain("object-cover");
    expect(image.parentElement?.getAttribute("class")).toContain("sm:min-h-[29rem]");
    expect(image.parentElement?.getAttribute("class")).toContain("lg:min-h-[29rem]");
  });
});

describe("HeroAssuranceStrip", () => {
  it("renders the supplied four-item assurance hierarchy", () => {
    render(<HeroAssuranceStrip />);

    expect(screen.getByText("99%+ Purity")).toBeTruthy();
    expect(screen.getByText("Lot-specific results")).toBeTruthy();
    expect(screen.getByText("Third-party tested")).toBeTruthy();
    expect(screen.getByText("Fast U.S. Shipping")).toBeTruthy();
    expect(screen.getByText("U.S.-Based Support")).toBeTruthy();
    expect(screen.queryByText("Next-Day Shipping")).toBeNull();
    expect(screen.getAllByRole("article")).toHaveLength(4);
  });
});
