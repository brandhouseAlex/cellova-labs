import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HeroProductImage } from "./page";

vi.mock("next/image", () => ({
  default: ({ src, alt, priority, className }: { src: string; alt: string; priority?: boolean; className?: string }) => (
    <span role="img" aria-label={alt} data-src={src} data-priority={String(priority)} data-class={className} />
  ),
}));

describe("HeroProductImage", () => {
  it("renders the supplied Cellova product visual as the prioritized accessible hero image", () => {
    render(<HeroProductImage />);

    const image = screen.getByRole("img", { name: "Cellova Labs research product lineup" });
    expect(image.getAttribute("data-src")).toContain("soQIwZUdfXIdMSCv.png");
    expect(image.getAttribute("data-priority")).toBe("true");
    expect(image.getAttribute("data-class")).toContain("object-cover");
  });
});
