import { NextRequest, NextResponse } from "next/server";
import { applyCooldown, enforceSameOrigin, hasCooldown, parseJsonBody, securityHeaders } from "@/lib/server/access-http";
import { startCustomerAccountAuthorization } from "@/lib/server/customer-account";
import { registerCustomer } from "@/lib/server/registration-service";
import { COOKIE_MAX_AGE, cookieOptions, getCookieName } from "@/lib/server/secure-cookie";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    enforceSameOrigin(request);
    if (await hasCooldown(request, "register")) {
      return securityHeaders(NextResponse.json({ success: false, error: "Please wait a moment before trying again." }, { status: 429 }));
    }
    const body = await parseJsonBody(request);
    const customer = await registerCustomer({
      firstName: String(body.firstName ?? ""),
      lastName: String(body.lastName ?? ""),
      email: String(body.email ?? ""),
      phone: String(body.phone ?? ""),
      companyName: String(body.companyName ?? ""),
      acceptsResearchUseTerms: body.acceptsResearchUseTerms === true,
    });
    const authorization = await startCustomerAccountAuthorization(
      customer.email,
      typeof body.returnTo === "string" ? body.returnTo : null
    );
    const response = NextResponse.json({ success: true, authorizationUrl: authorization.authorizationUrl });
    response.cookies.set(getCookieName("oauth"), authorization.transactionCookie, cookieOptions(COOKIE_MAX_AGE.oauth));
    return securityHeaders(await applyCooldown(response, "register"));
  } catch (_error) {
    return securityHeaders(await applyCooldown(NextResponse.json({ success: false, error: "We could not complete your registration. Please review your details and try again." }, { status: 400 }), "register"));
  }
}
