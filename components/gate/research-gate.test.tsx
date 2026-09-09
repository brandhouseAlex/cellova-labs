import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ResearchGate } from "./research-gate";

vi.mock("next/link", () => ({ default: ({ children, href, ...props }: React.ComponentProps<"a">) => <a href={href} {...props}>{children}</a> }));
vi.mock("next/image", () => ({ default: ({ alt }: { alt?: string }) => <span data-testid="next-image" data-alt={alt ?? ""} /> }));
vi.mock("@/components/gate/research-orbit", () => ({ ResearchOrbit: () => <div data-testid="research-orbit" /> }));

describe("ResearchGate", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: async () => ({ success: true }),
    }));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders the preserved Cellova gate as the public access experience", () => {
    render(<ResearchGate />);
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("renders passwordless login controls and shows consent only for account creation", async () => {
    const user = userEvent.setup();
    render(<ResearchGate />);
    expect(screen.queryByLabelText("Password")).toBeNull();
    expect(screen.queryByLabelText(/I confirm that I am 21/i)).toBeNull();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: /log in/i }));
    await user.click(screen.getByRole("tab", { name: /create account/i }));
    const consent = screen.getByLabelText(/I confirm that I am 21/i) as HTMLInputElement;
    expect(consent.type).toBe("checkbox");
    expect(consent.required).toBe(true);
    expect(consent.checked).toBe(false);
  });

  it("blocks registration until consent is explicitly checked and preserves the complete registration payload", async () => {
    const user = userEvent.setup();
    render(<ResearchGate />);
    await user.click(screen.getByRole("tab", { name: /create account/i }));
    const submit = screen.getByRole("button", { name: /create your research account/i }) as HTMLButtonElement;
    expect(submit.disabled).toBe(true);
    await user.type(screen.getByLabelText("First name"), "Ada");
    await user.type(screen.getByLabelText("Last name"), "Lovelace");
    await user.type(screen.getByLabelText("Phone number"), "+15550000000");
    await user.type(screen.getByLabelText("Company name"), "Cellova Research");
    await user.type(screen.getByLabelText("Email address"), "ada@example.com");
    expect(screen.queryByLabelText("Password")).toBeNull();
    await user.click(screen.getByLabelText(/I confirm that I am 21/i));
    expect(submit.disabled).toBe(false);
    await user.click(submit);
    await waitFor(() => expect(fetch).toHaveBeenCalledWith("/api/access/register", expect.objectContaining({ method: "POST" })));
    const [, request] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(request.body))).toEqual({
      firstName: "Ada",
      lastName: "Lovelace",
      phone: "+15550000000",
      companyName: "Cellova Research",
      email: "ada@example.com",
      acceptsResearchUseTerms: true,
      returnTo: null,
    });
  });

  it("uses the requested non-Shopify completion copy if authorization is unavailable", async () => {
    const user = userEvent.setup();
    render(<ResearchGate />);
    await user.click(screen.getByRole("tab", { name: /create account/i }));
    await user.type(screen.getByLabelText("First name"), "Ada");
    await user.type(screen.getByLabelText("Last name"), "Lovelace");
    await user.type(screen.getByLabelText("Phone number"), "+15550000000");
    await user.type(screen.getByLabelText("Company name"), "Cellova Research");
    await user.type(screen.getByLabelText("Email address"), "ada@example.com");
    await user.click(screen.getByLabelText(/I confirm that I am 21/i));
    await user.click(screen.getByRole("button", { name: /create your research account/i }));
    expect(await screen.findByText("Your research account is ready. Continue to receive your secure email verification code.")).toBeTruthy();
    expect(screen.queryByText(/Shopify/i)).toBeNull();
  });
});
