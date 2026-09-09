import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ProductToResearch } from "./product-to-research";

afterEach(cleanup);

describe("ProductToResearch", () => {
  it("renders the supplied four-step research path inside the shared homepage container", () => {
    render(<ProductToResearch />);

    expect(screen.getByRole("heading", { name: /a simpler path.*from selection to research/i })).toBeTruthy();
    expect(screen.getByText("Select")).toBeTruthy();
    expect(screen.getByText("Review")).toBeTruthy();
    expect(screen.getByText("Verify")).toBeTruthy();
    expect(screen.getByText("Research")).toBeTruthy();

    const section = screen.getByRole("region", { name: /a simpler path.*from selection to research/i });
    expect(section.firstElementChild?.className).toContain("home-page-container");
  });
});
