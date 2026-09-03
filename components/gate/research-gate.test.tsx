import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ResearchGate } from "./research-gate";

let pathname = "/";
let authenticated = false;
const login = vi.fn();
const register = vi.fn();

vi.mock("next/navigation", () => ({ usePathname: () => pathname }));
vi.mock("next/link", () => ({ default: ({ children, href, ...props }: React.ComponentProps<"a">) => <a href={href} {...props}>{children}</a> }));
vi.mock("next/image", () => ({ default: ({ alt }: { alt?: string }) => <span data-testid="next-image" data-alt={alt ?? ""} /> }));
vi.mock("@/components/gate/research-orbit", () => ({ ResearchOrbit: () => <div data-testid="research-orbit" /> }));
vi.mock("@/lib/auth/auth-store", () => ({
  useAuth: () => ({ isAuthenticated: authenticated, login, register }),
}));

describe("ResearchGate", () => {
  beforeEach(() => {
    pathname = "/";
    authenticated = false;
    login.mockResolvedValue({ success: true, customer: { id: "customer_1" } });
    register.mockResolvedValue({ success: true, customer: { id: "customer_1" } });
  });

  afterEach(() => cleanup());

  it("keeps protected routes gated while public information routes remain accessible", () => {
    const { rerender } = render(<ResearchGate />);
    expect(screen.getByRole("dialog")).toBeTruthy();
    pathname = "/contact";
    rerender(<ResearchGate />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("exposes keyboard-reachable controls and a real unchecked consent checkbox", async () => {
    const user = userEvent.setup();
    render(<ResearchGate />);
    const consent = screen.getByLabelText(/I confirm that I am 21/i) as HTMLInputElement;
    expect(consent.type).toBe("checkbox");
    expect(consent.checked).toBe(false);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: /log in/i }));
    const password = screen.getByLabelText("Password") as HTMLInputElement;
    expect(password.type).toBe("password");
    await user.click(screen.getByRole("button", { name: /show password/i }));
    expect(password.type).toBe("text");
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
    await user.type(screen.getByLabelText("Password"), "correct-horse-battery");
    await user.click(screen.getByLabelText(/I confirm that I am 21/i));
    expect(submit.disabled).toBe(false);
    await user.click(submit);
    await waitFor(() => expect(register).toHaveBeenCalledWith(expect.objectContaining({
      firstName: "Ada",
      lastName: "Lovelace",
      phone: "+15550000000",
      companyName: "Cellova Research",
      email: "ada@example.com",
      acceptsResearchUseTerms: true,
      researchUseConsentVersion: "research-network-v1.0",
    })));
  });
});
