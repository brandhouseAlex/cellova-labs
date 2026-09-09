import { NextRequest, NextResponse } from "next/server";
import { getAuthorizedCustomer } from "@/lib/server/customer-account";
import { deleteCookieOptions, getCookieName, type CellovaSessionCookie, unsealCookie } from "@/lib/server/secure-cookie";
import { securityHeaders } from "@/lib/server/access-http";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await unsealCookie<CellovaSessionCookie>(request.cookies.get(getCookieName("session"))?.value, "session");
  const customer = await getAuthorizedCustomer(session);
  if (!customer) {
    const response = NextResponse.json({ authenticated: false }, { status: 401 });
    response.cookies.set(getCookieName("session"), "", deleteCookieOptions());
    return securityHeaders(response);
  }
  return securityHeaders(NextResponse.json({
    authenticated: true,
    customer: {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      companyName: null,
      createdAt: customer.createdAt,
    },
  }));
}
