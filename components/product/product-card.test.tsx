import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CommerceProduct } from "@/lib/commerce/types";
import { ProductCard } from "./product-card";

const addItem = vi.fn<(...args: [string, number]) => Promise<void>>();

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} />,
}));

vi.mock("@/lib/auth/cart-store", () => ({
  useCart: () => ({ addItem, isLoading: false }),
}));

vi.mock("@/lib/auth/auth-store", () => ({
  useAuth: () => ({ isAuthenticated: true, isReady: true }),
}));

const multiVariantProduct: CommerceProduct = {
  id: "provider-product",
  handle: "provider-material",
  title: "Provider Material",
  description: "Provider-backed material.",
  productType: "Vials",
  tags: [],
  featuredImage: { url: "https://provider.example/hero.png", altText: "Provider material" },
  images: [],
  options: [{ id: "size", name: "Size", values: ["5 mg", "10 mg"] }],
  variants: [
    { id: "variant-unavailable", title: "5 mg", sku: "PV-5", availableForSale: false, price: { amount: "25.00", currencyCode: "USD" }, selectedOptions: { Size: "5 mg" } },
    { id: "variant-sellable", title: "10 mg", sku: "PV-10", availableForSale: true, price: { amount: "39.00", currencyCode: "USD" }, selectedOptions: { Size: "10 mg" } },
  ],
  priceRange: { minVariantPrice: { amount: "25.00", currencyCode: "USD" }, maxVariantPrice: { amount: "39.00", currencyCode: "USD" } },
  collections: ["research-peptides"],
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("ProductCard provider purchasability", () => {
  beforeEach(() => addItem.mockReset());

  it("adds an authenticated multi-variant product with its first sellable provider variant", async () => {
    addItem.mockResolvedValue();
    render(<ProductCard product={multiVariantProduct} />);

    fireEvent.click(screen.getByRole("button", { name: "Add to Cart" }));

    await waitFor(() => expect(addItem).toHaveBeenCalledWith("variant-sellable", 1));
  });
});
