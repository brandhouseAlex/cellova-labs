import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResearchStandardsBand } from "./research-standards-band";

describe("ResearchStandardsBand", () => {
  it("renders the supplied standards content and policy action", () => {
    render(<ResearchStandardsBand />);

    expect(screen.getByRole("heading", { name: /built for\s*serious research/i })).toBeTruthy();
    expect(screen.getByText("Research-Grade Materials")).toBeTruthy();
    expect(screen.getByText("Manufactured to meet the highest standards.")).toBeTruthy();
    expect(screen.getByText("Third-Party Tested")).toBeTruthy();
    expect(screen.getByText("Secure Packaging")).toBeTruthy();
    expect(screen.getByText("Dedicated Support")).toBeTruthy();
    expect(screen.getByRole("link", { name: /our standards/i }).getAttribute("href")).toBe("/policies/research-use");
  });
});
