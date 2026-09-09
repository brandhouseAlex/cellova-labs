import { NextRequest, NextResponse } from "next/server";
import { applyCooldown, enforceSameOrigin, hasCooldown, parseJsonBody, securityHeaders } from "@/lib/server/access-http";
import { CustomerAccountError, startCustomerAccountAuthorization } from "@/lib/server/customer-account";
import { INELIGIBLE_MESSAGE } from "@/lib/server/registration-service";
import { COOKIE_MAX_AGE, cookieOptions, getCookieName } from "@/lib/server/secure-cookie";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    enforceSameOrigin(request);
    if (await hasCooldown(request, "eligibility")) {
      return securityHeaders(NextResponse.json({ eligible: false, error: "Please wait a moment before trying again." }, { status: 429 }));
    }
    const body = await parseJsonBody(request);
    const start = await startCustomerAccountAuthorization(String(body.email ?? ""), typeof body.returnTo === "string" ? body.returnTo : null);
    const response = NextResponse.json({ eligible: true, authorizationUrl: start.authorizationUrl });
    response.cookies.set(getCookieName("oauth"), start.transactionCookie, cookieOptions(COOKIE_MAX_AGE.oauth));
    return securityHeaders(await applyCooldown(response, "eligibility"));
  } catch (error) {
    if (!(error instanceof CustomerAccountError && error.code === "ineligible")) {
      const category = error instanceof CustomerAccountError ? error.code : "shopify_lookup";
      console.error("[cellova-access] eligibility lookup failed", { category });
    }
    const message = error instanceof CustomerAccountError && error.code === "ineligible"
      ? INELIGIBLE_MESSAGE
      : "We could not verify account access. Please try again.";
    return securityHeaders(await applyCooldown(NextResponse.json({ eligible: false, error: message }, { status: 403 }), "eligibility"));
  }
}
