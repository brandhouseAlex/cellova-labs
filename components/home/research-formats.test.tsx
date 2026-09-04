import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ResearchFormats } from "./research-formats";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => <a href={href} {...props}>{children}</a>,
}));

describe("ResearchFormats", () => {
  it("renders labeled placeholders with working collection destinations", () => {
    render(<ResearchFormats />);

    const expected = [
      ["Vials", "/collections/vials"],
      ["Capsules", "/collections/capsules"],
      ["Serums", "/collections/serums"],
      ["Nasal Sprays", "/collections/sprays"],
    ] as const;

    expected.forEach(([label, href]) => {
      expect(screen.getByRole("img", { name: `${label} image placeholder` })).toBeTruthy();
      expect(screen.getByRole("link", { name: new RegExp(label, "i") }).getAttribute("href")).toBe(href);
    });
  });
});
