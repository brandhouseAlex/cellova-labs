import type {
  CommerceAuthInput,
  CommerceAuthResult,
  CommerceCart,
  CommerceCartItem,
  CommerceCollection,
  CommerceCustomer,
  CommerceOrder,
  CommercePaginatedResult,
  CommerceProduct,
  CommerceProductQuery,
  CommerceProvider,
  CommerceRegisterInput,
} from "@/lib/commerce/types";
import { mockProducts } from "@/lib/mock-data/products";
import { mockCollections } from "@/lib/mock-data/collections";

/**
 * Mock commerce provider.
 *
 * Behaves like a real backend against the demo catalog in lib/mock-data/,
 * so the entire storefront can run with zero external services. Cart state
 * is persisted to localStorage on the client. Customer authentication is
 * deliberately unavailable here: Cellova access is always owned by the
 * server-side Shopify authorization flow, including during mock catalog use.
 */

const CART_STORAGE_KEY = "cellova.cart";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function isBrowser() {
  return typeof window !== "undefined";
}

function money(amount: number | string) {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return { amount: n.toFixed(2), currencyCode: "USD" };
}

function emptyCart(id: string): CommerceCart {
  return {
    id,
    items: [],
    subtotal: money(0),
    discountTotal: money(0),
    estimatedShipping: null,
    estimatedTaxes: null,
    total: money(0),
    totalQuantity: 0,
    checkoutUrl: null,
  };
}

function recalc(cart: CommerceCart): CommerceCart {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + parseFloat(item.lineTotal.amount),
    0
  );
  const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal > 0 ? 9.0 : 0;
  const taxes = 0;
  const discount = parseFloat(cart.discountTotal.amount);
  const total = Math.max(0, subtotal - discount) + shipping + taxes;

  return {
    ...cart,
    subtotal: money(subtotal),
    estimatedShipping: subtotal > 0 ? money(shipping) : null,
    estimatedTaxes: subtotal > 0 ? money(taxes) : null,
    total: money(total),
    totalQuantity,
  };
}

function readCart(cartId: string): CommerceCart | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(`${CART_STORAGE_KEY}.${cartId}`);
    if (!raw) return null;
    return JSON.parse(raw) as CommerceCart;
  } catch {
    return null;
  }
}

function writeCart(cart: CommerceCart): CommerceCart {
  if (isBrowser()) {
    window.localStorage.setItem(
      `${CART_STORAGE_KEY}.${cart.id}`,
      JSON.stringify(cart)
    );
  }
  return cart;
}

function findVariant(variantId: string) {
  for (const product of mockProducts) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) return { product, variant };
  }
  return null;
}

function applySort(
  products: CommerceProduct[],
  sort: CommerceProductQuery["sort"]
): CommerceProduct[] {
  const list = [...products];
  switch (sort) {
    case "newest":
      return list.sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
      );
    case "price-asc":
      return list.sort(
        (a, b) =>
          parseFloat(a.priceRange.minVariantPrice.amount) -
          parseFloat(b.priceRange.minVariantPrice.amount)
      );
    case "price-desc":
      return list.sort(
        (a, b) =>
          parseFloat(b.priceRange.minVariantPrice.amount) -
          parseFloat(a.priceRange.minVariantPrice.amount)
      );
    case "alphabetical":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case "alphabetical-desc":
      return list.sort((a, b) => b.title.localeCompare(a.title));
    case "featured":
    default:
      return list;
  }
}

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

export const mockProvider: CommerceProvider = {
  name: "mock",

  /* ------------------------------ Catalog ------------------------------ */

  async getProducts(
    query: CommerceProductQuery = {}
  ): Promise<CommercePaginatedResult<CommerceProduct>> {
    let list = [...mockProducts];

    if (query.collection) {
      list = list.filter((p) => p.collections.includes(query.collection!));
    }

    if (query.productType) {
      list = list.filter((p) => p.productType === query.productType);
    }

    if (query.query) {
      const q = query.query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    list = applySort(list, query.sort);

    const perPage = query.perPage ?? 12;
    const page = Math.max(1, query.page ?? 1);
    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const items = list.slice((page - 1) * perPage, page * perPage);

    return { items, total, page, perPage, totalPages };
  },

  async getProductByHandle(handle: string): Promise<CommerceProduct | null> {
    return mockProducts.find((p) => p.handle === handle) ?? null;
  },

  async getCollections(): Promise<CommerceCollection[]> {
    return mockCollections;
  },

  async getCollectionByHandle(
    handle: string
  ): Promise<CommerceCollection | null> {
    return mockCollections.find((c) => c.handle === handle) ?? null;
  },

  async getProductTypes(): Promise<string[]> {
    return Array.from(new Set(mockProducts.map((p) => p.productType))).sort();
  },

  /* ------------------------------- Cart -------------------------------- */

  async createCart(): Promise<CommerceCart> {
    const id = `cart_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    return writeCart(emptyCart(id));
  },

  async getCart(cartId: string): Promise<CommerceCart | null> {
    return readCart(cartId);
  },

  async addCartItem(cartId, input): Promise<CommerceCart> {
    const cart = readCart(cartId) ?? emptyCart(cartId);
    const found = findVariant(input.variantId);
    if (!found) throw new Error(`Variant not found: ${input.variantId}`);

    const { product, variant } = found;
    const existing = cart.items.find((i) => i.variantId === variant.id);

    if (existing) {
      existing.quantity += input.quantity;
      existing.lineTotal = money(
        parseFloat(existing.price.amount) * existing.quantity
      );
    } else {
      const item: CommerceCartItem = {
        id: `line_${Date.now().toString(36)}_${Math.random()
          .toString(36)
          .slice(2, 6)}`,
        cartId,
        productId: product.id,
        productHandle: product.handle,
        productTitle: product.title,
        variantId: variant.id,
        variantTitle: variant.title,
        quantity: input.quantity,
        price: variant.price,
        lineTotal: money(parseFloat(variant.price.amount) * input.quantity),
        image: product.featuredImage,
      };
      cart.items.push(item);
    }

    return writeCart(recalc(cart));
  },

  async updateCartItem(cartId, lineId, quantity): Promise<CommerceCart> {
    const cart = readCart(cartId) ?? emptyCart(cartId);
    const item = cart.items.find((i) => i.id === lineId);
    if (item) {
      if (quantity <= 0) {
        cart.items = cart.items.filter((i) => i.id !== lineId);
      } else {
        item.quantity = quantity;
        item.lineTotal = money(parseFloat(item.price.amount) * quantity);
      }
    }
    return writeCart(recalc(cart));
  },

  async removeCartItem(cartId, lineId): Promise<CommerceCart> {
    const cart = readCart(cartId) ?? emptyCart(cartId);
    cart.items = cart.items.filter((i) => i.id !== lineId);
    return writeCart(recalc(cart));
  },

  /* --------------------------- Auth & customer -------------------------- */

  async login(_input: CommerceAuthInput): Promise<CommerceAuthResult> {
    return { success: false, error: "Customer authentication is managed by the secure Cellova access service." };
  },

  async register(_input: CommerceRegisterInput): Promise<CommerceAuthResult> {
    return { success: false, error: "Customer registration is managed by the secure Cellova access service." };
  },

  async logout(): Promise<void> {},

  async getCustomer(_token: string): Promise<CommerceCustomer | null> { return null; },

  /* ------------------------------- Orders ------------------------------ */

  async getOrders(_token: string): Promise<CommerceOrder[]> {
    return [];
  },

  async getOrderById(
    _token: string,
    _orderId: string
  ): Promise<CommerceOrder | null> {
    return null;
  },
};
