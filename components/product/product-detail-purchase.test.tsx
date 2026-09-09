import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CommerceProduct } from "@/lib/commerce/types";
import { ProductDetailPurchase } from "./product-detail-purchase";

vi.mock("@/lib/auth/cart-store", () => ({
  useCart: () => ({ addItem: vi.fn(), isLoading: false }),
}));

vi.mock("@/lib/auth/auth-store", () => ({
  useAuth: () => ({ isAuthenticated: true, isReady: true }),
}));

vi.mock("./product-gallery", () => ({
  ProductGallery: ({ images }: { images: Array<{ url: string }> }) => (
    <output data-testid="primary-gallery-image">{images[0]?.url ?? "none"}</output>
  ),
}));

const product: CommerceProduct = {
  id: "product-variant-media",
  handle: "variant-media",
  title: "Variant Media Material",
  description: "Provider-backed test record.",
  productType: "Vials",
  tags: [],
  featuredImage: { url: "https://provider.example/featured.png", altText: "Featured provider product image" },
  images: [{ url: "https://provider.example/featured.png", altText: "Featured provider product image" }],
  options: [{ id: "strength", name: "Strength", values: ["5 mg", "10 mg"] }],
  variants: [
    { id: "variant-5", title: "5 mg", sku: "MEDIA-5", availableForSale: true, price: { amount: "25.00", currencyCode: "USD" }, selectedOptions: { Strength: "5 mg" }, image: { url: "https://provider.example/5mg.png", altText: "5 mg provider variant image" } },
    { id: "variant-10", title: "10 mg", sku: "MEDIA-10", availableForSale: true, price: { amount: "39.00", currencyCode: "USD" }, selectedOptions: { Strength: "10 mg" }, image: { url: "https://provider.example/10mg.png", altText: "10 mg provider variant image" } },
  ],
  priceRange: { minVariantPrice: { amount: "25.00", currencyCode: "USD" }, maxVariantPrice: { amount: "39.00", currencyCode: "USD" } },
  collections: ["vials"],
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("ProductDetailPurchase variant media", () => {
  it("moves the selected provider variant image into the primary gallery position", () => {
    render(<ProductDetailPurchase product={product} hasCoa={false} category="Vials" />);

    expect(screen.getByTestId("pdp-variant-gallery").getAttribute("data-selected-variant")).toBe("variant-5");
    expect(screen.getByTestId("primary-gallery-image").textContent).toBe("https://provider.example/5mg.png");

    fireEvent.click(screen.getByRole("button", { name: "10 mg" }));

    expect(screen.getByTestId("pdp-variant-gallery").getAttribute("data-selected-variant")).toBe("variant-10");
    expect(screen.getByTestId("primary-gallery-image").textContent).toBe("https://provider.example/10mg.png");
  });
});
