import { NextRequest, NextResponse } from "next/server";
import { applyCooldown, enforceSameOrigin, hasCooldown, parseJsonBody, securityHeaders } from "@/lib/server/access-http";
import { AccessConfigurationError } from "@/lib/server/access-config";
import { ShopifyAdminError } from "@/lib/server/shopify-admin";
import { registerCustomer } from "@/lib/server/registration-service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    enforceSameOrigin(request);
    if (await hasCooldown(request, "register")) {
      return securityHeaders(NextResponse.json({ success: false, error: "Please wait a moment before trying again." }, { status: 429 }));
    }
    const body = await parseJsonBody(request);
    await registerCustomer({
      firstName: String(body.firstName ?? ""),
      lastName: String(body.lastName ?? ""),
      email: String(body.email ?? ""),
      phone: String(body.phone ?? ""),
      companyName: String(body.companyName ?? ""),
      acceptsResearchUseTerms: body.acceptsResearchUseTerms === true,
    });
    return securityHeaders(await applyCooldown(NextResponse.json({ success: true }), "register"));
  } catch (error) {
    const category = error instanceof AccessConfigurationError
      ? "configuration"
      : error instanceof ShopifyAdminError
        ? `admin_${error.category}_${error.operation}_${error.userErrorKind}`
        : "validation_or_unknown";
    console.error("[cellova-access] registration failed", { category });
    return securityHeaders(await applyCooldown(NextResponse.json({ success: false, error: "We could not complete your registration. Please review your details and try again." }, { status: 400 }), "register"));
  }
}
