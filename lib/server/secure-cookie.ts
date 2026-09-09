import { EncryptJWT, jwtDecrypt } from "jose";
import { isProduction, sessionSecret } from "@/lib/server/access-config";

type CookieKind = "oauth" | "session" | "cooldown";

export interface OAuthTransactionCookie {
  kind: "oauth";
  state: string;
  nonce: string;
  verifier: string;
  email: string;
  returnTo: string;
}

export interface CellovaSessionCookie {
  kind: "session";
  customerId: string;
  email: string;
  idToken: string;
}

export interface CooldownCookie {
  kind: "cooldown";
  action: "register" | "eligibility";
}

type SealedCookie = OAuthTransactionCookie | CellovaSessionCookie | CooldownCookie;

export const COOKIE_MAX_AGE = {
  oauth: 10 * 60,
  session: 60 * 60,
  cooldown: 20,
} as const;

function cookieName(kind: CookieKind): string {
  const prefix = isProduction() ? "__Host-cellova" : "cellova";
  return `${prefix}-${kind}`;
}

async function encryptionKey(): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(sessionSecret()));
  return new Uint8Array(digest);
}

export function getCookieName(kind: CookieKind): string {
  return cookieName(kind);
}

export async function sealCookie(value: SealedCookie, maxAgeSeconds: number): Promise<string> {
  return new EncryptJWT(value as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSeconds}s`)
    .encrypt(await encryptionKey());
}

export async function unsealCookie<T extends SealedCookie>(value: string | undefined, expectedKind: T["kind"]): Promise<T | null> {
  if (!value) return null;
  try {
    const { payload } = await jwtDecrypt(value, await encryptionKey());
    return payload.kind === expectedKind ? (payload as unknown as T) : null;
  } catch {
    return null;
  }
}

export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export function deleteCookieOptions() {
  return { ...cookieOptions(0), maxAge: 0 };
}
