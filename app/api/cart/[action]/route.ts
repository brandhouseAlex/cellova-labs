import { NextRequest, NextResponse } from "next/server";
import { getCommerceAdapter } from "@/lib/commerce/provider";
import { CommerceError } from "@/lib/commerce/types";

const validActions = new Set(["create", "get", "add", "update", "remove"]);
function responseError(error: unknown) { const message = error instanceof CommerceError ? error.message : "Your cart could not be updated. Please try again."; return NextResponse.json({ message }, { status: error instanceof CommerceError && error.kind === "invalid" ? 400 : 503 }); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.length > 0; }

export async function GET(request: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params; const cartId = request.nextUrl.searchParams.get("cartId");
  if (action !== "get" || !cartId) return NextResponse.json({ message: "Invalid cart request." }, { status: 400 });
  try { const cart = await (await getCommerceAdapter()).getCart(cartId); return cart ? NextResponse.json({ cart }) : NextResponse.json({ message: "That cart is no longer available." }, { status: 404 }); } catch (error) { return responseError(error); }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params; if (!validActions.has(action) || action === "get") return NextResponse.json({ message: "Invalid cart request." }, { status: 400 });
  const body = await request.json().catch(() => null) as { cartId?: unknown; lines?: unknown; lineIds?: unknown } | null; if (!body) return NextResponse.json({ message: "Invalid cart request." }, { status: 400 });
  try {
    const commerce = await getCommerceAdapter();
    if (action === "create" && Array.isArray(body.lines) && body.lines.every((line) => typeof line === "object" && line && isNonEmptyString((line as { variantId?: unknown }).variantId) && Number.isInteger((line as { quantity?: unknown }).quantity))) return NextResponse.json({ cart: await commerce.createCart(body.lines as { variantId: string; quantity: number }[]) });
    if (action === "add" && isNonEmptyString(body.cartId) && Array.isArray(body.lines)) return NextResponse.json({ cart: await commerce.addToCart(body.cartId, body.lines as { variantId: string; quantity: number }[]) });
    if (action === "update" && isNonEmptyString(body.cartId) && Array.isArray(body.lines)) return NextResponse.json({ cart: await commerce.updateCart(body.cartId, body.lines as { lineId: string; quantity: number }[]) });
    if (action === "remove" && isNonEmptyString(body.cartId) && Array.isArray(body.lineIds) && body.lineIds.every(isNonEmptyString)) return NextResponse.json({ cart: await commerce.removeFromCart(body.cartId, body.lineIds) });
    return NextResponse.json({ message: "Invalid cart request." }, { status: 400 });
  } catch (error) { return responseError(error); }
}
