import { NextResponse } from "next/server";

import {
  fetchCustomerRegistrationDefinition,
  ShopifyDefinitionVerificationError,
} from "@/lib/server/shopify-admin-definition";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

/**
 * TEMPORARY: authorized only to verify the immutable field keys of the
 * existing customer_registration definition. Remove this route immediately
 * after the deployed verification result has been recorded.
 */
export async function GET() {
  try {
    const definition = await fetchCustomerRegistrationDefinition();
    return NextResponse.json({ definition }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    if (error instanceof ShopifyDefinitionVerificationError) {
      return NextResponse.json(
        { error: "verification_unavailable" },
        { status: 503, headers: NO_STORE_HEADERS }
      );
    }

    return NextResponse.json(
      { error: "verification_unavailable" },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }
}
