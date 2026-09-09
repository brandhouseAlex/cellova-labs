import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TransparencyCoa } from "./transparency-coa";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => <a href={href} {...props}>{children}</a>,
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => <span role="img" aria-label={alt} data-src={src} className={className} />,
}));

describe("TransparencyCoa", () => {
  it("uses the supplied COA visual and retains the COA Library action", () => {
    render(<TransparencyCoa />);

    expect(screen.getByRole("heading", { name: /complete transparency/i })).toBeTruthy();
    const coaVisual = screen.getByRole("img", { name: /aod-9604 certificate of analysis/i });
    expect(coaVisual.getAttribute("data-src")).toBe("/brand/aod-9604-coa.png");
    expect(coaVisual.className).toContain("lg:max-h-[30rem]");
    expect(screen.getByRole("link", { name: /view coa library/i }).getAttribute("href")).toBe("/coa-library");
    expect(screen.getByText("Endotoxin & heavy metals testing")).toBeTruthy();
  });
});
