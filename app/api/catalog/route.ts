import { NextRequest, NextResponse } from "next/server";
import { CommerceError } from "@/lib/commerce/types";
import { getCommerceAdapter } from "@/lib/commerce/provider";

export async function GET(request: NextRequest) {
  const after = request.nextUrl.searchParams.get("after"); const collectionHandle = request.nextUrl.searchParams.get("collection");
  try { const page = await (await getCommerceAdapter()).getProductPage({ first: 12, after, collectionHandle: collectionHandle || undefined }); return NextResponse.json(page); } catch (error) { return NextResponse.json({ message: error instanceof CommerceError ? error.message : "The catalog is temporarily unavailable." }, { status: 503 }); }
}
