import { NextResponse } from "next/server";

import {
  fetchCustomerRegistrationDefinition,
  ShopifyDefinitionVerificationError,
} from "@/lib/server/shopify-admin-definition";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
  Pragma: "no-cache",
};

/**
 * TEMPORARY, READ-ONLY endpoint. It returns no credential, access token,
 * customer, metaobject entry, product, order, or upstream error information.
 * Remove immediately after recording the Customer Registration field keys.
 */
export async function GET() {
  try {
    const definition = await fetchCustomerRegistrationDefinition();
    return NextResponse.json(definition, { headers: noStoreHeaders });
  } catch (error) {
    const code = error instanceof ShopifyDefinitionVerificationError ? error.code : "graphql_error";
    return NextResponse.json({ error: code }, { status: 503, headers: noStoreHeaders });
  }
}
