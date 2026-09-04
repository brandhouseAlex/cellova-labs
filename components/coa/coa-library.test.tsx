import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { CommerceProduct } from "@/lib/commerce/types";
import { CoaLibrary } from "./coa-library";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => <a href={href} {...props}>{children}</a>,
}));

vi.mock("next/image", () => ({
  default: () => null,
}));

const product: CommerceProduct = {
  id: "product-1",
  handle: "research-material",
  title: "Provider Product Title",
  description: "Research material",
  productType: "Vials",
  tags: [],
  featuredImage: null,
  images: [],
  options: [],
  variants: [],
  priceRange: { minVariantPrice: { amount: "10.00", currencyCode: "USD" }, maxVariantPrice: { amount: "10.00", currencyCode: "USD" } },
  collections: ["vials"],
  createdAt: "2026-01-01T00:00:00.000Z",
  coas: [
    { productName: "Provider Product Title", lotNumber: "LOT-A", testedDate: "2026-01-10", laboratory: "Lab One", identityMs: "Pass", purityHplc: "99.1%", netContent: "10 mg", endotoxin: "Pass", heavyMetals: "Pass", pdfUrl: "https://example.com/lot-a.pdf" },
    { productName: "Provider Product Title", lotNumber: "LOT-B", testedDate: "2026-02-10", laboratory: "Lab One", identityMs: "Pass", purityHplc: "99.4%", netContent: "10 mg", endotoxin: "Pass", heavyMetals: "Pass", pdfUrl: "https://example.com/lot-b.pdf" },
  ],
};

describe("CoaLibrary", () => {
  it("lists every complete assigned COA instead of collapsing a product to one batch", () => {
    render(<CoaLibrary products={[product]} />);

    expect(screen.getAllByText("LOT-A").length).toBeGreaterThan(0);
    expect(screen.getAllByText("LOT-B").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /view product details/i })).toHaveLength(4);
  });
});
