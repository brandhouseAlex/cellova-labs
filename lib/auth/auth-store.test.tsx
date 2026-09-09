import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "./auth-store";

function SessionProbe() {
  const { isAuthenticated, isReady } = useAuth();
  return <p data-testid="session-state">{isReady ? (isAuthenticated ? "authenticated" : "anonymous") : "loading"}</p>;
}

describe("AuthProvider session restoration", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ authenticated: true, customer: { id: "customer_1", email: "researcher@example.com", firstName: "Research", lastName: "User", createdAt: "2026-01-01T00:00:00.000Z" } }),
    }));
  });

  afterEach(() => vi.unstubAllGlobals());

  it("restores only a server-validated HttpOnly session after a page reload", async () => {
    render(<AuthProvider><SessionProbe /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId("session-state").textContent).toBe("authenticated"));
    expect(fetch).toHaveBeenCalledWith("/api/access/session", { credentials: "include", cache: "no-store" });
    expect(window.localStorage.getItem("cellova.session")).toBeNull();
  });
});
