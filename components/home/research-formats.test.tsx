import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResearchFormats } from "./research-formats";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => <a href={href} {...props}>{children}</a>,
}));

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} />,
}));

describe("ResearchFormats", () => {
  it("renders supplied format images with working collection destinations", () => {
    render(<ResearchFormats />);

    const expected = [
      ["Vials", "/collections/vials"],
      ["Capsules", "/collections/capsules"],
      ["Serums", "/collections/serums"],
      ["Nasal Sprays", "/collections/sprays"],
    ] as const;

    expected.forEach(([label, href]) => {
      expect(screen.getByRole("img", { name: `Cellova Labs ${label} research format` })).toBeTruthy();
      expect(screen.getByRole("link", { name: new RegExp(label, "i") }).getAttribute("href")).toBe(href);
    });
  });
});
