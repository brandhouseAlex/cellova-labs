import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TransparencyCoa } from "./transparency-coa";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => <a href={href} {...props}>{children}</a>,
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <span role="img" aria-label={alt} data-src={src} />,
}));

describe("TransparencyCoa", () => {
  it("uses the supplied COA visual and retains the COA Library action", () => {
    render(<TransparencyCoa />);

    expect(screen.getByRole("heading", { name: /complete transparency/i })).toBeTruthy();
    expect(screen.getByRole("img", { name: /sermorelin 10mg certificate of analysis/i }).getAttribute("data-src")).toBe("/brand/sermorelin-coa.png");
    expect(screen.getByRole("link", { name: /view coa library/i }).getAttribute("href")).toBe("/coa-library");
    expect(screen.getByText("Endotoxin & heavy metals testing")).toBeTruthy();
  });
});
