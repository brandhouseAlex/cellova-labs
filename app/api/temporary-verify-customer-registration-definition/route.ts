import { NextResponse } from "next/server";

import {
  fetchCustomerRegistrationDefinition,
  ShopifyDefinitionVerificationError,
} from "@/lib/server/shopify-admin-definition";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

/**
 * TEMPORARY, read-only Shopify definition inspection endpoint. Remove after
 * this authorized schema confirmation; it returns no credentials, tokens, or
 * customer, metaobject-entry, product, or order data.
 */
export async function GET() {
  try {
    const definition = await fetchCustomerRegistrationDefinition();
    return NextResponse.json(definition, { headers: NO_STORE_HEADERS });
  } catch (error) {
    if (error instanceof ShopifyDefinitionVerificationError) {
      return NextResponse.json({ error: "verification_unavailable" }, { status: 503, headers: NO_STORE_HEADERS });
    }

    return NextResponse.json({ error: "verification_unavailable" }, { status: 503, headers: NO_STORE_HEADERS });
  }
}
