import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/server/secure-cookie", () => ({ getCookieName: () => "cellova-session", unsealCookie: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/server/customer-account", () => ({ getAuthorizedCustomer: vi.fn().mockResolvedValue(null) }));

import { proxy } from "@/proxy";

describe("server route protection", () => {
  it("redirects a direct logged-out product request to /access before rendering the route", async () => {
    const response = await proxy(new NextRequest("https://www.cellovalabs.com/products/example?size=5mg"));
    expect(response.headers.get("location")).toBe("https://www.cellovalabs.com/access?returnTo=%2Fproducts%2Fexample%3Fsize%3D5mg");
  });
});
