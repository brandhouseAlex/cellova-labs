import { render, screen } from "@testing-library/react";
import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import type { CommerceProduct } from "@/lib/commerce/types";
import { ProductInformationTabs } from "./product-information-tabs";

const product: CommerceProduct = {
  id: "product-1",
  handle: "keyboard-product",
  title: "Keyboard Product",
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
  coas: [{ productName: "Keyboard Product", lotNumber: "LOT-KEY", testedDate: "2026-01-10", laboratory: "Lab One", identityMs: "Pass", purityHplc: "99.1%", netContent: "10 mg", endotoxin: "Pass", heavyMetals: "Pass", pdfUrl: "https://provider.example/keyboard-product-coa.pdf", pdfName: "keyboard-product-coa.pdf" }],
};

describe("ProductInformationTabs", () => {
  afterEach(() => cleanup());

  it("activates revised PDP documentation tabs through native keyboard interaction", async () => {
    const user = userEvent.setup();
    render(<ProductInformationTabs product={product} />);

    const disclosureTab = screen.getByRole("tab", { name: "FDA Disclosure & Intended Use" });
    disclosureTab.focus();
    await user.keyboard("{Enter}");

    expect(disclosureTab.getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tab", { name: "Certificate of Analysis" }).getAttribute("aria-selected")).toBe("false");
  });

  it("renders the flat reference-aligned COA tables with provider values and download action", () => {
    render(<ProductInformationTabs product={product} />);

    const section = screen.getByLabelText("Product information");
    expect(section.className).toContain("bg-paper");
    expect(section.className).not.toContain("bg-gradient");
    expect(screen.getAllByRole("heading", { name: "Batch Information" }).length).toBe(2);
    expect(screen.getAllByRole("heading", { name: "Analytical Results" }).length).toBe(2);
    expect(screen.getAllByText("LOT-KEY").length).toBe(2);
    expect(screen.getAllByText("RP-HPLC (214 nm)").length).toBe(2);
    const downloadLinks = screen.getAllByRole("link", { name: "Download COA" });
    expect(downloadLinks.length).toBe(2);
    expect(downloadLinks.every((link) => link.getAttribute("href") === "https://provider.example/keyboard-product-coa.pdf")).toBe(true);
  });
});
