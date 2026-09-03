import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "./auth-store";

const { getCustomer } = vi.hoisted(() => ({ getCustomer: vi.fn() }));
vi.mock("@/lib/commerce", () => ({
  commerce: { getCustomer, login: vi.fn(), register: vi.fn(), logout: vi.fn() },
}));

function SessionProbe() {
  const { isAuthenticated, isReady } = useAuth();
  return <p data-testid="session-state">{isReady ? (isAuthenticated ? "authenticated" : "anonymous") : "loading"}</p>;
}

describe("AuthProvider session restoration", () => {
  beforeEach(() => {
    window.localStorage.clear();
    getCustomer.mockResolvedValue({ id: "customer_1", email: "researcher@example.com" });
  });

  afterEach(() => window.localStorage.clear());

  it("restores a saved customer session after a page reload", async () => {
    window.localStorage.setItem("cellova.session", "mock_session");
    render(<AuthProvider><SessionProbe /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId("session-state").textContent).toBe("authenticated"));
    expect(getCustomer).toHaveBeenCalledWith("mock_session");
  });
});
