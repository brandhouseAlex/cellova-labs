import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let provider: typeof import("./index").shopifyProvider;
let fetchMock: ReturnType<typeof vi.fn>;

const cart = {
  id: "gid://shopify/Cart/1",
  checkoutUrl: "https://cellova-labs-w5v5hxfa.myshopify.com/cart/c/secure-checkout",
  totalQuantity: 1,
  lines: {
    edges: [{ cursor: "line-cursor", node: {
      id: "gid://shopify/CartLine/1",
      quantity: 1,
      cost: { amountPerQuantity: { amount: "24.00", currencyCode: "USD" }, totalAmount: { amount: "24.00", currencyCode: "USD" } },
      merchandise: { id: "gid://shopify/ProductVariant/1", title: "10 mg", image: null, product: { id: "gid://shopify/Product/1", handle: "test-product", title: "Test Product", featuredImage: null } },
    }}],
    pageInfo: { hasNextPage: false, endCursor: null },
  },
  discountAllocations: [],
  cost: { subtotalAmount: { amount: "24.00", currencyCode: "USD" }, totalAmount: { amount: "24.00", currencyCode: "USD" }, totalTaxAmount: null },
};

beforeEach(async () => {
  vi.resetModules();
  process.env.COMMERCE_PROVIDER = "shopify";
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN = "cellova-labs-w5v5hxfa.myshopify.com";
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN = "public-storefront-token";
  fetchMock = vi.fn(async (_url, init) => {
    const query = JSON.parse(String(init?.body)).query as string;
    const payloadKey = query.includes("CartCreate") ? "cartCreate"
      : query.includes("CartLinesAdd") ? "cartLinesAdd"
      : query.includes("CartLinesUpdate") ? "cartLinesUpdate"
      : "cartLinesRemove";
    return new Response(JSON.stringify({ data: { [payloadKey]: { cart, userErrors: [], warnings: [] } } }), { status: 200, headers: { "content-type": "application/json" } });
  });
  vi.stubGlobal("fetch", fetchMock);
  provider = (await import("./index")).shopifyProvider;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

function lastVariables() {
  return JSON.parse(String(fetchMock.mock.calls.at(-1)?.[1]?.body)).variables;
}

describe("Shopify Storefront Cart API provider", () => {
  it("uses cartCreate with the normalized authenticated buyer email", async () => {
    await provider.createCart({ buyerEmail: " RESEARCHER@EXAMPLE.COM " });
    expect(lastVariables()).toEqual({ input: { buyerIdentity: { email: "researcher@example.com" } } });
  });

  it("uses cartLinesAdd, cartLinesUpdate, and cartLinesRemove with real cart and variant identifiers", async () => {
    await provider.addCartItem(cart.id, { variantId: "gid://shopify/ProductVariant/1", quantity: 2 });
    expect(lastVariables()).toEqual({ cartId: cart.id, lines: [{ merchandiseId: "gid://shopify/ProductVariant/1", quantity: 2 }] });

    await provider.updateCartItem(cart.id, "gid://shopify/CartLine/1", 3);
    expect(lastVariables()).toEqual({ cartId: cart.id, lines: [{ id: "gid://shopify/CartLine/1", quantity: 3 }] });

    await provider.removeCartItem(cart.id, "gid://shopify/CartLine/1");
    expect(lastVariables()).toEqual({ cartId: cart.id, lineIds: ["gid://shopify/CartLine/1"] });
  });
});
