import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ProductGallery } from "./product-gallery";

describe("ProductGallery primary provider media", () => {
  it("keeps provider media fill positioning and full-containment fitting across gallery selections", () => {
    render(
      <ProductGallery
        title="Provider material"
        hasCoa={false}
        images={[
          { url: "https://provider.example/selected.png", altText: "Selected provider material" },
          { url: "https://provider.example/secondary.png", altText: "Secondary provider material" },
          { url: "https://provider.example/third.png", altText: "Third provider material" },
        ]}
      />
    );

    const image = screen.getByRole("img", { name: "Selected provider material" });
    expect(image.getAttribute("src")).toBe("https://provider.example/selected.png");
    expect(image.className).toContain("object-contain");
    expect(image.className).toContain("p-2");
    expect(image.className).toContain("absolute");

    fireEvent.click(screen.getByRole("button", { name: "Show image 2 of 3" }));
    const secondaryImage = screen.getByRole("img", { name: "Secondary provider material" });
    expect(secondaryImage.getAttribute("src")).toBe("https://provider.example/secondary.png");
    expect(secondaryImage.className).toContain("object-contain");
    expect(secondaryImage.className).toContain("p-2");
  });
});
