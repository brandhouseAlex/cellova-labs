import { NextRequest, NextResponse } from "next/server";
import { canonicalOrigin, isProduction } from "@/lib/server/access-config";
import { COOKIE_MAX_AGE, cookieOptions, getCookieName, sealCookie, type CooldownCookie, unsealCookie } from "@/lib/server/secure-cookie";

export async function parseJsonBody(request: NextRequest): Promise<Record<string, unknown>> {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(length) && length > 8_192) throw new Error("Request too large");
  const body: unknown = await request.json();
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid request");
  return body as Record<string, unknown>;
}

export function enforceSameOrigin(request: NextRequest): void {
  const origin = request.headers.get("origin");
  if (!origin) return;
  const allowed = new Set([canonicalOrigin(), request.nextUrl.origin]);
  if (!allowed.has(origin)) throw new Error("Cross-origin request rejected");
}

export async function hasCooldown(request: NextRequest, action: CooldownCookie["action"]): Promise<boolean> {
  const encoded = request.cookies.get(getCookieName("cooldown"))?.value;
  const cooldown = await unsealCookie<CooldownCookie>(encoded, "cooldown");
  return cooldown?.action === action;
}

export async function applyCooldown(response: NextResponse, action: CooldownCookie["action"]): Promise<NextResponse> {
  const cooldown: CooldownCookie = { kind: "cooldown", action };
  response.cookies.set(getCookieName("cooldown"), await sealCookie(cooldown, COOKIE_MAX_AGE.cooldown), cookieOptions(COOKIE_MAX_AGE.cooldown));
  return response;
}

export function securityHeaders(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "same-origin");
  if (isProduction()) response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  return response;
}
