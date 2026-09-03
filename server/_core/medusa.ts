/**
 * Medusa Store API adapter.
 *
 * This module mirrors the normalized contract returned by the Shopify adapter.
 * It uses Medusa Store API public endpoints and keeps provider-specific payloads
 * out of the tRPC router and React storefront.
 */
import { TRPCError } from "@trpc/server";
import type {
  Cart,
  CartItem,
  Collection,
  Image,
  LotDocumentation,
  Money,
  Product,
  ProductOption,
  ProductVariant,
} from "@shared/commerce/types";
import type { CartLineInput, CartLineUpdate, ListProductsOptions } from "../commerce/types";

type MedusaImage = { url?: string; metadata?: { width?: number; height?: number } };
type MedusaPrice = { amount?: number | string; currency_code?: string; calculated_amount?: number | string; calculated_price?: number | string };
type MedusaVariant = {
  id: string;
  title?: string;
  sku?: string | null;
  manage_inventory?: boolean;
  allow_backorder?: boolean;
  options?: Array<{ value?: string; option?: { title?: string } }>;
  calculated_price?: MedusaPrice | null;
  prices?: MedusaPrice[];
};
type MedusaProduct = {
  id: string;
  handle?: string | null;
  title: string;
  description?: string | null;
  subtitle?: string | null;
  type?: { value?: string } | null;
  collection?: { handle?: string | null; title?: string | null } | null;
  tags?: Array<{ value?: string }>;
  thumbnail?: string | null;
  images?: MedusaImage[];
  options?: Array<{ title?: string; values?: Array<{ value?: string }> }>;
  variants?: MedusaVariant[];
  metadata?: Record<string, unknown> | null;
};
type MedusaCollection = {
  id: string;
  handle?: string | null;
  title: string;
  metadata?: Record<string, unknown> | null;
};
type MedusaCartItem = {
  id: string;
  quantity: number;
  unit_price?: number | string;
  subtotal?: number | string;
  total?: number | string;
  title?: string;
  subtitle?: string | null;
  thumbnail?: string | null;
  variant_id?: string;
  variant?: { id?: string; title?: string; product?: { handle?: string; title?: string; thumbnail?: string | null } };
};
type MedusaCart = {
  id: string;
  items?: MedusaCartItem[];
  currency_code?: string;
  subtotal?: number | string;
  total?: number | string;
  checkout_url?: string | null;
};

const MONEY_DIVISOR = 100;

function medusaBaseUrl(): string {
  return (process.env.MEDUSA_BACKEND_URL ?? "").replace(/\/+$/, "");
}
function medusaPublishableKey(): string {
  return process.env.MEDUSA_PUBLISHABLE_KEY ?? "";
}
function medusaRegionId(): string {
  return process.env.MEDUSA_REGION_ID ?? "";
}
function medusaCurrencyCode(): string {
  return (process.env.MEDUSA_CURRENCY_CODE ?? "usd").toUpperCase();
}
function medusaCheckoutTemplate(): string {
  return process.env.MEDUSA_CHECKOUT_URL ?? "";
}

export function isMedusaConfigured(): boolean {
  return Boolean(medusaBaseUrl() && medusaPublishableKey());
}

function medusaHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-publishable-api-key": medusaPublishableKey(),
  };
}

async function medusaFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!isMedusaConfigured()) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Medusa Store API is not configured" });
  }

  let response: Response;
  try {
    response = await fetch(`${medusaBaseUrl()}${path}`, {
      ...init,
      headers: { ...medusaHeaders(), ...(init.headers ?? {}) },
    });
  } catch (error) {
    console.error("[Medusa] Network error", error);
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Medusa Store API is unreachable" });
  }

  const payload = await response.json().catch(() => ({})) as { message?: string; type?: string };
  if (!response.ok) {
    const code = response.status >= 400 && response.status < 500 ? "BAD_REQUEST" : "INTERNAL_SERVER_ERROR";
    console.error("[Medusa] HTTP", response.status, payload);
    throw new TRPCError({ code, message: payload.message || `Medusa Store API returned HTTP ${response.status}` });
  }
  return payload as T;
}

function toMoney(amount: number | string | undefined, currencyCode = medusaCurrencyCode()): Money {
  const numeric = typeof amount === "string" ? Number(amount) : amount ?? 0;
  return { amount: (Number.isFinite(numeric) ? numeric / MONEY_DIVISOR : 0).toFixed(2), currencyCode: currencyCode.toUpperCase() };
}

function imageFrom(url: string | null | undefined, altText: string | null = null): Image | null {
  return url ? { url, altText } : null;
}

function selectedOptions(variant: MedusaVariant): ProductVariant["selectedOptions"] {
  return (variant.options ?? []).map(option => ({ name: option.option?.title || "Option", value: option.value || "" }));
}

function variantMoney(variant: MedusaVariant): Money {
  const calculated = variant.calculated_price;
  const firstPrice = calculated ?? variant.prices?.[0];
  return toMoney(firstPrice?.calculated_amount ?? firstPrice?.calculated_price ?? firstPrice?.amount, firstPrice?.currency_code);
}

function normalizeVariant(variant: MedusaVariant): ProductVariant {
  return {
    id: variant.id,
    title: variant.title || variant.sku || "Default option",
    price: variantMoney(variant),
    compareAtPrice: null,
    availableForSale: variant.manage_inventory === false || variant.allow_backorder === true || true,
    selectedOptions: selectedOptions(variant),
  };
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeLotDocumentation(metadata: Record<string, unknown> | null | undefined): LotDocumentation | null {
  const nested = metadata?.cellova_coa;
  const source = nested && typeof nested === "object" ? nested as Record<string, unknown> : metadata ?? {};
  const value = (key: string) => text(source[key] ?? metadata?.[`cellova_coa_${key}`]);
  const lot: LotDocumentation = {
    lotNumber: value("lot_number"),
    testedDate: value("tested_date"),
    laboratory: value("laboratory"),
    identityMs: value("identity_ms"),
    purityHplc: value("purity_hplc"),
    netContent: value("net_content"),
    endotoxin: value("endotoxin"),
    heavyMetals: value("heavy_metals"),
    pdfUrl: value("pdf"),
  };
  return value("status").toLowerCase() === "available" && Object.values(lot).every(Boolean) ? lot : null;
}

function normalizeProduct(raw: MedusaProduct): Product {
  const variants = (raw.variants ?? []).map(normalizeVariant);
  const prices = variants.map(variant => Number(variant.price.amount));
  const imageUrls = [raw.thumbnail, ...(raw.images ?? []).map(image => image.url)].filter((url): url is string => Boolean(url));
  const uniqueImages = Array.from(new Set(imageUrls)).map(url => imageFrom(url)).filter((image): image is Image => Boolean(image));
  const productOptions: ProductOption[] = (raw.options ?? []).map(option => ({
    name: option.title || "Option",
    values: (option.values ?? []).map(value => value.value || "").filter(Boolean),
  }));
  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : 0;
  const currency = variants[0]?.price.currencyCode || medusaCurrencyCode();

  return {
    id: raw.id,
    handle: raw.handle || raw.id,
    title: raw.title,
    description: raw.description || raw.subtitle || "",
    descriptionHtml: raw.description || raw.subtitle || "",
    productType: raw.type?.value || null,
    vendor: null,
    tags: (raw.tags ?? []).map(tag => tag.value || "").filter(Boolean),
    images: uniqueImages,
    priceRange: { min: { amount: min.toFixed(2), currencyCode: currency }, max: { amount: max.toFixed(2), currencyCode: currency } },
    options: productOptions,
    variants,
    lotDocumentation: normalizeLotDocumentation(raw.metadata),
  };
}

function normalizeCollection(raw: MedusaCollection): Collection {
  const metadataImage = text(raw.metadata?.image);
  return { id: raw.id, handle: raw.handle || raw.id, title: raw.title, description: text(raw.metadata?.description), image: imageFrom(metadataImage) };
}

function cartCheckoutUrl(cart: MedusaCart): string {
  if (cart.checkout_url) return cart.checkout_url;
  const template = medusaCheckoutTemplate();
  if (!template) return "";
  return template.includes("{cart_id}") ? template.replaceAll("{cart_id}", encodeURIComponent(cart.id)) : `${template}${template.includes("?") ? "&" : "?"}cart_id=${encodeURIComponent(cart.id)}`;
}

function normalizeCart(raw: MedusaCart): Cart {
  const currency = (raw.currency_code || medusaCurrencyCode()).toUpperCase();
  const items: CartItem[] = (raw.items ?? []).map(item => {
    const product = item.variant?.product;
    const unit = toMoney(item.unit_price, currency);
    return {
      lineId: item.id,
      variantId: item.variant_id || item.variant?.id || item.id,
      productHandle: product?.handle || product?.title || item.title || "product",
      productTitle: product?.title || item.title || "Product",
      variantTitle: item.variant?.title || item.subtitle || "Default option",
      image: imageFrom(item.thumbnail || product?.thumbnail),
      unitPrice: unit,
      quantity: item.quantity,
      lineTotal: toMoney(item.total ?? item.subtotal ?? Number(unit.amount) * MONEY_DIVISOR * item.quantity, currency),
    };
  });
  return {
    id: raw.id,
    checkoutUrl: cartCheckoutUrl(raw),
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: toMoney(raw.subtotal, currency),
    total: toMoney(raw.total, currency),
  };
}

function query(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== "") search.set(key, String(value)); });
  const suffix = search.toString();
  return suffix ? `?${suffix}` : "";
}

export async function listProducts(options: ListProductsOptions = {}): Promise<Product[]> {
  const first = options.first ?? 24;
  let collectionId: string | undefined;
  if (options.collectionHandle) {
    const result = await medusaFetch<{ collections?: MedusaCollection[] }>(`/store/collections${query({ handle: options.collectionHandle, limit: 1 })}`);
    collectionId = result.collections?.[0]?.id;
    if (!collectionId) return [];
  }
  const result = await medusaFetch<{ products?: MedusaProduct[] }>(`/store/products${query({ limit: first, collection_id: collectionId, region_id: medusaRegionId() })}`);
  return (result.products ?? []).map(normalizeProduct);
}

export async function getProductByHandle(handle: string): Promise<Product> {
  const result = await medusaFetch<{ products?: MedusaProduct[] }>(`/store/products${query({ handle, limit: 1, region_id: medusaRegionId() })}`);
  const product = result.products?.[0];
  if (!product) throw new TRPCError({ code: "NOT_FOUND", message: `Product "${handle}" not found` });
  return normalizeProduct(product);
}

export async function listCollections(first = 10): Promise<Collection[]> {
  const result = await medusaFetch<{ collections?: MedusaCollection[] }>(`/store/collections${query({ limit: first })}`);
  return (result.collections ?? []).map(normalizeCollection);
}

export async function getCollectionByHandle(handle: string): Promise<Collection> {
  const result = await medusaFetch<{ collections?: MedusaCollection[] }>(`/store/collections${query({ handle, limit: 1 })}`);
  const collection = result.collections?.[0];
  if (!collection) throw new TRPCError({ code: "NOT_FOUND", message: `Collection "${handle}" not found` });
  return normalizeCollection(collection);
}

export async function createCart(lines: CartLineInput[]): Promise<Cart> {
  const result = await medusaFetch<{ cart: MedusaCart }>("/store/carts", { method: "POST", body: JSON.stringify({ items: lines.map(line => ({ variant_id: line.variantId, quantity: line.quantity })), ...(medusaRegionId() ? { region_id: medusaRegionId() } : {}) }) });
  return normalizeCart(result.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  try {
    const result = await medusaFetch<{ cart: MedusaCart }>(`/store/carts/${encodeURIComponent(cartId)}`);
    return result.cart ? normalizeCart(result.cart) : null;
  } catch (error) {
    if (error instanceof TRPCError && error.code === "BAD_REQUEST") return null;
    throw error;
  }
}

export async function addCartLines(cartId: string, lines: CartLineInput[]): Promise<Cart> {
  let cart: Cart | null = null;
  for (const line of lines) {
    const result = await medusaFetch<{ cart: MedusaCart }>(`/store/carts/${encodeURIComponent(cartId)}/line-items`, { method: "POST", body: JSON.stringify({ variant_id: line.variantId, quantity: line.quantity }) });
    cart = normalizeCart(result.cart);
  }
  if (!cart) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Medusa cart add returned no cart" });
  return cart;
}

export async function updateCartLines(cartId: string, updates: CartLineUpdate[]): Promise<Cart> {
  let cart: Cart | null = null;
  for (const update of updates) {
    const result = await medusaFetch<{ cart: MedusaCart }>(`/store/carts/${encodeURIComponent(cartId)}/line-items/${encodeURIComponent(update.lineId)}`, { method: "POST", body: JSON.stringify({ quantity: update.quantity }) });
    cart = normalizeCart(result.cart);
  }
  if (!cart) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Medusa cart update returned no cart" });
  return cart;
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<Cart> {
  let cart: Cart | null = null;
  for (const lineId of lineIds) {
    const result = await medusaFetch<{ cart: MedusaCart }>(`/store/carts/${encodeURIComponent(cartId)}/line-items/${encodeURIComponent(lineId)}`, { method: "DELETE" });
    cart = normalizeCart(result.cart);
  }
  if (!cart) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Medusa cart removal returned no cart" });
  return cart;
}
