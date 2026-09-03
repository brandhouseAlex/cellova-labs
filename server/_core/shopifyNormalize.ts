/**
 * The decoupling seam.
 *
 * This file is the ONLY place in the codebase that's allowed to know the
 * shape of a Shopify Storefront GraphQL response. Everything it returns is
 * typed against `shared/commerce/types` — backend-agnostic. If a future store
 * ever swaps Shopify for another commerce backend, this file (plus the
 * GraphQL fragments in `shopify.ts`) is what changes; the router, the
 * shared types, and the UI all stay put.
 *
 * The corresponding test in `server/commerce.router.test.ts` serializes a
 * normalized `Product` and asserts the substring `"edges"` is absent — that's
 * the canary for this seam.
 */

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
  SelectedOption,
} from "@shared/commerce/types";

// ---- Raw Shopify shapes (kept private to this file) ----

type RawMoney = { amount: string; currencyCode: string };
type RawImage = { url: string; altText: string | null; width?: number; height?: number };
type RawSelectedOption = { name: string; value: string };
type RawProductOption = { name: string; values: string[] };
type Edges<T> = { edges: Array<{ node: T }> };
type RawMetafield = { value: string | null } | null;
type RawLotDocumentation = {
  lotNumber: RawMetafield;
  testedDate: RawMetafield;
  laboratory: RawMetafield;
  identityMs: RawMetafield;
  purityHplc: RawMetafield;
  netContent: RawMetafield;
  endotoxin: RawMetafield;
  heavyMetals: RawMetafield;
  pdfUrl: RawMetafield;
  status: RawMetafield;
};

type RawVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: RawMoney;
  compareAtPrice: RawMoney | null;
  selectedOptions: RawSelectedOption[];
};

export type RawProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  productType: string | null;
  vendor: string | null;
  tags: string[];
  options: RawProductOption[];
  priceRange: { minVariantPrice: RawMoney; maxVariantPrice: RawMoney };
  images: Edges<RawImage>;
  variants: Edges<RawVariant>;
  coaRecords?: RawMetafield;
  lotNumber: RawMetafield;
  testedDate: RawMetafield;
  laboratory: RawMetafield;
  identityMs: RawMetafield;
  purityHplc: RawMetafield;
  netContent: RawMetafield;
  endotoxin: RawMetafield;
  heavyMetals: RawMetafield;
  pdfUrl: RawMetafield;
  status: RawMetafield;
};

export type RawCollection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: RawImage | null;
};

export type RawCartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: RawMoney };
  merchandise: {
    id: string;
    title: string;
    price: RawMoney;
    product: {
      handle: string;
      title: string;
      images: Edges<{ url: string; altText: string | null; width?: number; height?: number }>;
    };
  };
};

export type RawCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { totalAmount: RawMoney; subtotalAmount: RawMoney };
  lines: Edges<RawCartLine>;
};

// ---- Normalizers ----

function normalizeMoney(m: RawMoney): Money {
  return { amount: m.amount, currencyCode: m.currencyCode };
}

function normalizeImage(i: RawImage): Image {
  return { url: i.url, altText: i.altText ?? null, width: i.width, height: i.height };
}

function normalizeSelectedOption(o: RawSelectedOption): SelectedOption {
  return { name: o.name, value: o.value };
}

function normalizeProductOption(o: RawProductOption): ProductOption {
  return { name: o.name, values: o.values };
}

function normalizeVariant(v: RawVariant): ProductVariant {
  return {
    id: v.id,
    title: v.title,
    price: normalizeMoney(v.price),
    compareAtPrice: v.compareAtPrice ? normalizeMoney(v.compareAtPrice) : null,
    availableForSale: v.availableForSale,
    selectedOptions: (v.selectedOptions ?? []).map(normalizeSelectedOption),
  };
}

function textValue(metafield: RawMetafield): string {
  return metafield?.value?.trim() ?? "";
}

/** Only a complete, published Cellova lot record is exposed to public UI. */
function normalizeLotDocumentation(raw: RawLotDocumentation): LotDocumentation | null {
  const documentation: LotDocumentation = {
    lotNumber: textValue(raw.lotNumber),
    testedDate: textValue(raw.testedDate),
    laboratory: textValue(raw.laboratory),
    identityMs: textValue(raw.identityMs),
    purityHplc: textValue(raw.purityHplc),
    netContent: textValue(raw.netContent),
    endotoxin: textValue(raw.endotoxin),
    heavyMetals: textValue(raw.heavyMetals),
    pdfUrl: textValue(raw.pdfUrl),
  };

  return textValue(raw.status).toLowerCase() === "available" && Object.values(documentation).every(Boolean)
    ? documentation
    : null;
}

function coerceMetafield(record: Record<string, unknown>, snake: string, camel: string): RawMetafield {
  const value = record[snake] ?? record[camel];
  return { value: typeof value === "string" ? value : null };
}

function normalizeLotRecords(raw: RawProduct): LotDocumentation[] {
  const primary = normalizeLotDocumentation(raw);
  const serialized = textValue(raw.coaRecords ?? null);
  if (!serialized) return primary ? [primary] : [];
  try {
    const parsed = JSON.parse(serialized) as unknown;
    if (!Array.isArray(parsed)) return primary ? [primary] : [];
    const records = parsed.map(item => {
      const record = item && typeof item === "object" ? item as Record<string, unknown> : {};
      return normalizeLotDocumentation({
        lotNumber: coerceMetafield(record, "lot_number", "lotNumber"), testedDate: coerceMetafield(record, "tested_date", "testedDate"), laboratory: coerceMetafield(record, "laboratory", "laboratory"), identityMs: coerceMetafield(record, "identity_ms", "identityMs"), purityHplc: coerceMetafield(record, "purity_hplc", "purityHplc"), netContent: coerceMetafield(record, "net_content", "netContent"), endotoxin: coerceMetafield(record, "endotoxin", "endotoxin"), heavyMetals: coerceMetafield(record, "heavy_metals", "heavyMetals"), pdfUrl: coerceMetafield(record, "pdf", "pdfUrl"), status: coerceMetafield(record, "status", "status"),
      });
    }).filter((record): record is LotDocumentation => Boolean(record));
    const merged = [...records, ...(primary ? [primary] : [])];
    return merged.filter((record, index) => merged.findIndex(item => item.lotNumber === record.lotNumber) === index).sort((a, b) => b.testedDate.localeCompare(a.testedDate));
  } catch {
    return primary ? [primary] : [];
  }
}

export function normalizeProduct(p: RawProduct): Product {
  const lotDocumentations = normalizeLotRecords(p);
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    descriptionHtml: p.descriptionHtml,
    productType: p.productType || null,
    vendor: p.vendor || null,
    tags: p.tags ?? [],
    images: p.images.edges.map(e => normalizeImage(e.node)),
    priceRange: {
      min: normalizeMoney(p.priceRange.minVariantPrice),
      max: normalizeMoney(p.priceRange.maxVariantPrice),
    },
    options: (p.options ?? []).map(normalizeProductOption),
    variants: p.variants.edges.map(e => normalizeVariant(e.node)),
    lotDocumentation: lotDocumentations[0] ?? null,
    lotDocumentations,
  };
}

export function normalizeCollection(c: RawCollection): Collection {
  return {
    id: c.id,
    handle: c.handle,
    title: c.title,
    description: c.description,
    image: c.image ? normalizeImage(c.image) : null,
  };
}

function normalizeCartItem(line: RawCartLine): CartItem {
  const img = line.merchandise.product.images.edges[0]?.node ?? null;
  return {
    lineId: line.id,
    variantId: line.merchandise.id,
    productHandle: line.merchandise.product.handle,
    productTitle: line.merchandise.product.title,
    variantTitle: line.merchandise.title,
    image: img ? normalizeImage(img) : null,
    unitPrice: normalizeMoney(line.merchandise.price),
    quantity: line.quantity,
    lineTotal: normalizeMoney(line.cost.totalAmount),
  };
}

/**
 * Always append `channel=online_store` to checkout URLs so a password-protected
 * dev store still lets the hosted checkout render. Doing this server-side
 * (here, behind `normalizeCart`) means no caller can forget it.
 */
export function withChannelParam(checkoutUrl: string): string {
  if (!checkoutUrl) return checkoutUrl;
  return checkoutUrl.includes("?")
    ? `${checkoutUrl}&channel=online_store`
    : `${checkoutUrl}?channel=online_store`;
}

export function normalizeCart(c: RawCart): Cart {
  return {
    id: c.id,
    checkoutUrl: withChannelParam(c.checkoutUrl),
    items: c.lines.edges.map(e => normalizeCartItem(e.node)),
    itemCount: c.totalQuantity,
    subtotal: normalizeMoney(c.cost.subtotalAmount),
    total: normalizeMoney(c.cost.totalAmount),
  };
}
