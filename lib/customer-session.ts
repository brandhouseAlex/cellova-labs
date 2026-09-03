import "server-only";

import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const cookieName = "cellova-customer-session";
const encoder = new TextEncoder();
function secret() { const value = process.env.JWT_SECRET; if (!value) throw new Error("Server session configuration is unavailable."); return encoder.encode(value); }

export type CustomerSession = { accessToken: string; expiresAt: string };

export async function readCustomerSession(): Promise<CustomerSession | null> {
  const token = (await cookies()).get(cookieName)?.value; if (!token) return null;
  try { const result = await jwtVerify(token, secret()); const accessToken = result.payload.accessToken; const expiresAt = result.payload.expiresAt; return typeof accessToken === "string" && typeof expiresAt === "string" ? { accessToken, expiresAt } : null; } catch { return null; }
}

export async function writeCustomerSession(session: CustomerSession) {
  const ttl = Math.max(3600, Number(process.env.CELLOVA_CUSTOMER_SESSION_TTL_SECONDS ?? 1209600));
  const token = await new SignJWT({ accessToken: session.accessToken, expiresAt: session.expiresAt }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(`${ttl}s`).sign(secret());
  (await cookies()).set(cookieName, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: ttl });
}

export async function clearCustomerSession() { (await cookies()).set(cookieName, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 }); }
