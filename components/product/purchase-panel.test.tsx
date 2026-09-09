import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FulfillmentDetails } from "./purchase-panel";

describe("FulfillmentDetails", () => {
  it("renders the supplied post-price fulfillment hierarchy", () => {
    render(<FulfillmentDetails />);

    expect(screen.getByText("Free standard shipping")).toBeTruthy();
    expect(screen.getByText("Orders over $150")).toBeTruthy();
    expect(screen.getByText("Next day shipping")).toBeTruthy();
    expect(screen.getByText("Mon–Thu before 12 p.m. EST")).toBeTruthy();
    expect(screen.getByText("UPS")).toBeTruthy();
    expect(screen.getByText(/Overnight options available\.$/)).toBeTruthy();
    expect(screen.getByText("Secure checkout")).toBeTruthy();
    expect(screen.getByText("Expert support")).toBeTruthy();
  });
});
