import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ResearchFormats } from "./research-formats";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => <a href={href} {...props}>{children}</a>,
}));

vi.mock("next/image", () => ({
  default: ({ alt, className, src }: { alt: string; className?: string; src: string }) => <span role="img" aria-label={alt} data-class={className} data-src={src} />,
}));

afterEach(cleanup);

describe("ResearchFormats", () => {
  it("renders supplied format images with working collection destinations", () => {
    render(<ResearchFormats />);

    const expected = [
      ["Vials", "/collections/vials", "CVzBWYPsxZmtMOCa.png"],
      ["Capsules", "/collections/capsules", "KxKqnhDyAfksyKUY.png"],
      ["Serums", "/collections/serums", "wiWHkEBMMcYVKZaZ.png"],
      ["Nasal Sprays", "/collections/sprays", "qqKBQCUxyHpGZTjm.png"],
    ] as const;

    expected.forEach(([label, href, asset]) => {
      expect(screen.getByRole("img", { name: `Cellova Labs ${label} research format` })).toBeTruthy();
      expect(screen.getByRole("img", { name: `Cellova Labs ${label} research format` }).getAttribute("data-class")).toContain("mix-blend-multiply");
      expect(screen.getByRole("img", { name: `Cellova Labs ${label} research format` }).getAttribute("data-src")).toContain(asset);
      expect(screen.getByRole("link", { name: new RegExp(label, "i") }).getAttribute("href")).toBe(href);
    });
  });

  it("uses the Spark section-eyebrow treatment", () => {
    render(<ResearchFormats />);

    expect(screen.getByText("Research Formats").className).toContain("!text-[#F2A63C]");
  });
});
