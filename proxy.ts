import { NextResponse, type NextRequest } from "next/server";
import { getAuthorizedCustomer } from "@/lib/server/customer-account";
import { getCookieName, type CellovaSessionCookie, unsealCookie } from "@/lib/server/secure-cookie";

function accessRedirect(request: NextRequest): NextResponse {
  const destination = new URL("/access", request.url);
  destination.searchParams.set("returnTo", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  const response = NextResponse.redirect(destination);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function proxy(request: NextRequest) {
  const session = await unsealCookie<CellovaSessionCookie>(request.cookies.get(getCookieName("session"))?.value, "session");
  try {
    const customer = await getAuthorizedCustomer(session);
    return customer ? NextResponse.next() : accessRedirect(request);
  } catch {
    return accessRedirect(request);
  }
}

export const config = {
  matcher: [
    "/",
    "/products/:path*",
    "/collections/:path*",
    "/shop/:path*",
    "/coa-library/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/account/:path*",
  ],
};
