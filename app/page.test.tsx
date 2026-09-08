import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroProductImage } from "./page";

describe("HeroProductImage", () => {
  it("renders the supplied Cellova product visual as an accessible responsive hero background", () => {
    render(<HeroProductImage />);

    const image = screen.getByRole("img", { name: "Cellova Labs research product lineup" });
    expect(image.getAttribute("style")).toContain("soQIwZUdfXIdMSCv.png");
    expect(image.getAttribute("class")).toContain("bg-cover");
    expect(image.getAttribute("class")).toContain("lg:min-h-[29rem]");
  });
});
