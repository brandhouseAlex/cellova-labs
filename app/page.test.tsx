import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroProductImage } from "./page";

describe("HeroProductImage", () => {
  it("renders the supplied Cellova product visual as an accessible responsive hero image", () => {
    render(<HeroProductImage />);

    const image = screen.getByRole("img", { name: "Cellova Labs research product lineup" });
    expect(image.getAttribute("src")).toContain("soQIwZUdfXIdMSCv.png");
    expect(image.getAttribute("class")).toContain("object-cover");
    expect(image.parentElement?.getAttribute("class")).toContain("sm:min-h-[29rem]");
    expect(image.parentElement?.getAttribute("class")).toContain("lg:min-h-[29rem]");
  });
});
