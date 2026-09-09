import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductGallery } from "./product-gallery";

vi.mock("next/image", () => ({
  default: ({ alt, className, src }: { alt: string; className?: string; src: string }) => (
    <span role="img" aria-label={alt} className={className} data-src={src} />
  ),
}));

describe("ProductGallery primary provider media", () => {
  it("keeps fill positioning available for the selected provider image", () => {
    render(
      <ProductGallery
        title="Provider material"
        hasCoa={false}
        images={[{ url: "https://provider.example/selected.png", altText: "Selected provider material" }]}
      />
    );

    const image = screen.getByRole("img", { name: "Selected provider material" });
    expect(image.getAttribute("data-src")).toBe("https://provider.example/selected.png");
    expect(image.className).toContain("object-contain");
    expect(image.className).not.toContain("relative");
  });
});
