import { NextRequest, NextResponse } from "next/server";
import { ACCESS_PATH } from "@/lib/server/access-config";
import { customerAccountLogoutUrl } from "@/lib/server/customer-account";
import { deleteCookieOptions, getCookieName, type CellovaSessionCookie, unsealCookie } from "@/lib/server/secure-cookie";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await unsealCookie<CellovaSessionCookie>(request.cookies.get(getCookieName("session"))?.value, "session");
  let destination = new URL(ACCESS_PATH, request.url).toString();
  if (session?.idToken) {
    try {
      destination = await customerAccountLogoutUrl(session.idToken);
    } catch {
      // Ending the Cellova session locally is the fail-closed fallback.
    }
  }
  const response = NextResponse.redirect(destination);
  response.cookies.set(getCookieName("session"), "", deleteCookieOptions());
  response.cookies.set(getCookieName("oauth"), "", deleteCookieOptions());
  return response;
}
