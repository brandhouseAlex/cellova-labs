import { NextRequest, NextResponse } from "next/server";
import { completeCustomerAccountAuthorization, CustomerAccountError } from "@/lib/server/customer-account";
import { ACCESS_PATH } from "@/lib/server/access-config";
import { COOKIE_MAX_AGE, cookieOptions, deleteCookieOptions, getCookieName, type OAuthTransactionCookie, unsealCookie } from "@/lib/server/secure-cookie";

export const runtime = "nodejs";

function accessFailure(request: NextRequest): NextResponse {
  const response = NextResponse.redirect(new URL(`${ACCESS_PATH}?error=authentication`, request.url));
  response.cookies.set(getCookieName("oauth"), "", deleteCookieOptions());
  return response;
}

export async function GET(request: NextRequest) {
  const transaction = await unsealCookie<OAuthTransactionCookie>(request.cookies.get(getCookieName("oauth"))?.value, "oauth");
  if (!transaction) return accessFailure(request);
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  if (!code || request.nextUrl.searchParams.get("error")) return accessFailure(request);
  try {
    const completed = await completeCustomerAccountAuthorization(code, state, transaction);
    const response = NextResponse.redirect(new URL(completed.returnTo, request.url));
    response.cookies.set(getCookieName("session"), completed.sessionCookie, cookieOptions(COOKIE_MAX_AGE.session));
    response.cookies.set(getCookieName("oauth"), "", deleteCookieOptions());
    return response;
  } catch (error) {
    if (error instanceof CustomerAccountError) return accessFailure(request);
    return accessFailure(request);
  }
}
