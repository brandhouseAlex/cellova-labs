import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CommerceProduct } from "@/lib/commerce/types";
import { PurchasePanel } from "./purchase-panel";

const addItem = vi.fn<(...args: [string, number]) => Promise<void>>();

vi.mock("@/lib/auth/cart-store", () => ({
  useCart: () => ({ addItem, isLoading: false }),
}));

vi.mock("@/lib/auth/auth-store", () => ({
  useAuth: () => ({ isAuthenticated: true, isReady: true }),
}));

const baseProduct: CommerceProduct = {
  id: "product-1",
  handle: "research-material",
  title: "Research Material",
  description: "Provider-backed research material.",
  productType: "Vials",
  tags: [],
  featuredImage: null,
  images: [],
  options: [{ id: "strength", name: "Strength", values: ["5 mg", "10 mg"] }],
  variants: [
    { id: "variant-5", title: "5 mg", sku: "RM-5", availableForSale: true, price: { amount: "25.00", currencyCode: "USD" }, selectedOptions: { Strength: "5 mg" } },
    { id: "variant-10", title: "10 mg", sku: "RM-10", availableForSale: true, price: { amount: "39.00", currencyCode: "USD" }, selectedOptions: { Strength: "10 mg" } },
  ],
  priceRange: { minVariantPrice: { amount: "25.00", currencyCode: "USD" }, maxVariantPrice: { amount: "39.00", currencyCode: "USD" } },
  collections: [],
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("PurchasePanel functional behavior", () => {
  beforeEach(() => {
    cleanup();
    addItem.mockReset();
  });

  it("updates provider-backed variants and quantity before adding the selected variant to cart", async () => {
    addItem.mockResolvedValue();
    render(<PurchasePanel product={baseProduct} />);

    expect(screen.getByTestId("pdp-purchase-panel")).toBeTruthy();
    expect(screen.getByRole("group", { name: "Quantity" })).toBeTruthy();
    expect(screen.getAllByTestId("fulfillment-row")).toHaveLength(5);
    expect(screen.getByTestId("selected-variant-price").textContent).toContain("$25.00");
    fireEvent.click(screen.getByRole("button", { name: "10 mg" }));
    expect(screen.getByTestId("selected-variant-price").textContent).toContain("$39.00");

    fireEvent.click(screen.getByRole("button", { name: "Increase quantity" }));
    fireEvent.click(screen.getByRole("button", { name: "Add to Cart" }));

    await waitFor(() => expect(addItem).toHaveBeenCalledWith("variant-10", 2));
  });

  it("hides a single Default Title and retains the add-to-cart action", async () => {
    addItem.mockResolvedValue();
    const defaultVariant: CommerceProduct = {
      ...baseProduct,
      options: [{ id: "title", name: "Title", values: ["Default Title"] }],
      variants: [{ id: "variant-default", title: "Default Title", sku: null, availableForSale: false, price: { amount: "15.00", currencyCode: "USD" }, selectedOptions: { Title: "Default Title" } }],
    };
    render(<PurchasePanel product={defaultVariant} />);

    expect(screen.getByTestId("selected-variant-price").textContent).toBe("$15.00");
    expect(screen.queryByText("Default Title")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Add to Cart" }));
    await waitFor(() => expect(addItem).toHaveBeenCalledWith("variant-default", 1));
  });
});
