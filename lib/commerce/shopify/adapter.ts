import "server-only";
import { cache } from "react";
import { configuredCoaMetaobjectType, configuredProductMetafields, productMetafieldMap } from "./metafields";
import type { Cart, CartItem, COAData, Collection, CommerceAdapter, Money, Product, ProductDocumentation, ProductImage, ProductPage, ProductVariant } from "../types";
import { CommerceError } from "../types";

const apiVersion = process.env.SHOPIFY_API_VERSION ?? process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION ?? "2025-04";
const storeDomain = process.env.SHOPIFY_STORE_DOMAIN ?? process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontToken = process.env.SHOPIFY_STOREFRONT_API_ACCESS_TOKEN ?? process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const endpoint = storeDomain ? `https://${storeDomain}/api/${apiVersion}/graphql.json` : "";

type RawMoney = Money;
type RawImage = ProductImage;
type RawEdge<T> = { node: T };
type RawProduct = Omit<Product, "images" | "variants" | "priceRange"> & { priceRange: { minVariantPrice: Money; maxVariantPrice: Money }; images: { edges: RawEdge<RawImage>[] }; variants: { edges: RawEdge<ProductVariant>[] } };
type RawCollection = Collection;
type RawCart = { id: string; checkoutUrl: string; totalQuantity: number; cost: { totalAmount: Money; subtotalAmount: Money }; lines: { edges: RawEdge<{ id: string; quantity: number; cost: { totalAmount: Money }; merchandise: { id: string; title: string; price: Money; product: { handle: string; title: string; featuredImage: RawImage | null } } }>[]} };
type RawMetafield = { namespace: string; key: string; value: string | null; reference?: { type?: string; fields?: Array<{ key: string; value: string | null }> } | null };

const MONEY = "amount currencyCode";
const IMAGE = "url altText width height";
const PRODUCT_FIELDS = `id handle title description descriptionHtml productType vendor tags options { name values } priceRange { minVariantPrice { ${MONEY} } maxVariantPrice { ${MONEY} } } images(first: 8) { edges { node { ${IMAGE} } } } variants(first: 25) { edges { node { id title availableForSale price { ${MONEY} } compareAtPrice { ${MONEY} } selectedOptions { name value } } } }`;
const CART_FIELDS = `id checkoutUrl totalQuantity cost { totalAmount { ${MONEY} } subtotalAmount { ${MONEY} } } lines(first: 100) { edges { node { id quantity cost { totalAmount { ${MONEY} } } merchandise { ... on ProductVariant { id title price { ${MONEY} } product { handle title featuredImage { ${IMAGE} } } } } } } }`;

function configured() { return Boolean(endpoint && storefrontToken); }

async function storefrontRequest<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!configured()) throw new CommerceError("The catalog is being prepared. Please return shortly.", "configuration");
  let response: Response;
  try {
    response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": storefrontToken! }, body: JSON.stringify({ query, variables }), next: { revalidate: 60 } });
  } catch { throw new CommerceError("The catalog is temporarily unavailable. Please try again shortly."); }
  if (!response.ok) throw new CommerceError("The catalog is temporarily unavailable. Please try again shortly.");
  const body = await response.json() as { data?: T; errors?: { message: string }[] };
  if (body.errors?.length || !body.data) throw new CommerceError("The catalog is temporarily unavailable. Please try again shortly.");
  return body.data;
}

function product(raw: RawProduct): Product { return { ...raw, images: raw.images.edges.map(({ node }) => node), variants: raw.variants.edges.map(({ node }) => node), priceRange: { min: raw.priceRange.minVariantPrice, max: raw.priceRange.maxVariantPrice } }; }
function collection(raw: RawCollection): Collection { return raw; }
function cart(raw: RawCart): Cart {
  const items: CartItem[] = raw.lines.edges.flatMap(({ node }) => node.merchandise ? [{ lineId: node.id, variantId: node.merchandise.id, productHandle: node.merchandise.product.handle, productTitle: node.merchandise.product.title, variantTitle: node.merchandise.title, image: node.merchandise.product.featuredImage, unitPrice: node.merchandise.price, quantity: node.quantity, lineTotal: node.cost.totalAmount }] : []);
  return { id: raw.id, checkoutUrl: raw.checkoutUrl, itemCount: raw.totalQuantity, subtotal: raw.cost.subtotalAmount, total: raw.cost.totalAmount, items };
}
function ensureCart(payload: { cart: RawCart | null; userErrors: { message: string }[] }): Cart { if (payload.userErrors?.[0]) throw new CommerceError("We could not update your cart. Please confirm the product is still available.", "invalid"); if (!payload.cart) throw new CommerceError("We could not update your cart. Please try again."); return cart(payload.cart); }

function valueFor(field: keyof typeof productMetafieldMap, metafields: Array<RawMetafield | null>) {
  const identifier = productMetafieldMap[field];
  if (!identifier) return undefined;
  return metafields.find((item) => item?.namespace === identifier.namespace && item.key === identifier.key)?.value?.trim() || undefined;
}

function verifiedDocumentUrl(value: string | undefined) {
  if (!value) return undefined;
  try { const url = new URL(value); return url.protocol === "https:" ? url.toString() : undefined; } catch { return undefined; }
}

function valueFromMetaobject(field: keyof typeof productMetafieldMap, metafields: Array<RawMetafield | null>) {
  const referenceKey = productMetafieldMap.coaMetaobjectReference;
  if (!referenceKey) return undefined;
  const reference = metafields.find((item) => item?.namespace === referenceKey.namespace && item.key === referenceKey.key)?.reference;
  if (!reference || (configuredCoaMetaobjectType && reference.type !== configuredCoaMetaobjectType)) return undefined;
  const key = productMetafieldMap[field]?.key;
  return key ? reference.fields?.find((item) => item.key === key)?.value?.trim() || undefined : undefined;
}

function documentation(handle: string, title: string, metafields: Array<RawMetafield | null>): ProductDocumentation | null {
  const value = (field: keyof typeof productMetafieldMap) => valueFor(field, metafields) ?? valueFromMetaobject(field, metafields);
  const storageInstructions = value("storageInstructions");
  const intendedUse = value("intendedUse");
  const coa: COAData = {
    productHandle: handle,
    productName: value("productName") ?? title,
    lotNumber: value("lotNumber"), testedDate: value("testedDate"), laboratory: value("laboratory"),
    identity: value("identity"), purity: value("purity"), netContent: value("netContent"),
    endotoxin: value("endotoxin"), heavyMetals: value("heavyMetals"), pdfUrl: verifiedDocumentUrl(value("pdfUrl")),
  };
  const hasCoaValue = [coa.lotNumber, coa.testedDate, coa.laboratory, coa.identity, coa.purity, coa.netContent, coa.endotoxin, coa.heavyMetals, coa.pdfUrl].some(Boolean);
  return storageInstructions || intendedUse || hasCoaValue ? { storageInstructions, intendedUse, coa: hasCoaValue ? coa : undefined } : null;
}

async function documentationForProduct(handle: string): Promise<ProductDocumentation | null> {
  const identifiers = configuredProductMetafields();
  if (!identifiers.length) return null;
  const result = await storefrontRequest<{ product: { handle: string; title: string; metafields: Array<RawMetafield | null> } | null }>(`query ProductDocumentation($handle: String!, $identifiers: [HasMetafieldsIdentifier!]!) { product(handle: $handle) { handle title metafields(identifiers: $identifiers) { namespace key value reference { ... on Metaobject { type fields { key value } } } } } }`, { handle, identifiers });
  return result.product ? documentation(result.product.handle, result.product.title, result.product.metafields) : null;
}

export const shopifyAdapter: CommerceAdapter = {
  getProducts: cache(async ({ first = 24, collectionHandle }: { first?: number; collectionHandle?: string } = {}) => {
    const data = collectionHandle
      ? await storefrontRequest<{ collection: { products: { edges: RawEdge<RawProduct>[] } } | null }>(`query CollectionProducts($handle: String!, $first: Int!) { collection(handle: $handle) { products(first: $first, sortKey: TITLE) { edges { node { ${PRODUCT_FIELDS} } } } } }`, { handle: collectionHandle, first })
      : await storefrontRequest<{ products: { edges: RawEdge<RawProduct>[] } }>(`query Products($first: Int!) { products(first: $first, sortKey: TITLE) { edges { node { ${PRODUCT_FIELDS} } } } }`, { first });
    const edges = "products" in data ? data.products.edges : data.collection?.products.edges ?? [];
    return edges.map(({ node }) => product(node));
  }),
  getProductPage: async ({ first = 24, after = null, collectionHandle }: { first?: number; after?: string | null; collectionHandle?: string } = {}): Promise<ProductPage> => {
    const pageSize = Math.min(Math.max(first, 1), 50);
    const query = collectionHandle
      ? `query CollectionProductPage($handle: String!, $first: Int!, $after: String) { collection(handle: $handle) { products(first: $first, after: $after, sortKey: TITLE) { edges { node { ${PRODUCT_FIELDS} } } pageInfo { hasNextPage endCursor } } } }`
      : `query ProductPage($first: Int!, $after: String) { products(first: $first, after: $after, sortKey: TITLE) { edges { node { ${PRODUCT_FIELDS} } } pageInfo { hasNextPage endCursor } } }`;
    const data = await storefrontRequest<{ products?: { edges: RawEdge<RawProduct>[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } }; collection?: { products: { edges: RawEdge<RawProduct>[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } | null } | null }>(query, collectionHandle ? { handle: collectionHandle, first: pageSize, after } : { first: pageSize, after });
    const connection = data.products ?? data.collection?.products;
    return { products: connection?.edges.map(({ node }) => product(node)) ?? [], nextCursor: connection?.pageInfo.endCursor ?? null, hasNextPage: connection?.pageInfo.hasNextPage ?? false };
  },
  getProduct: cache(async (handle) => { const data = await storefrontRequest<{ product: RawProduct | null }>(`query Product($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`, { handle }); return data.product ? product(data.product) : null; }),
  getCollections: cache(async (first = 20) => { const data = await storefrontRequest<{ collections: { edges: RawEdge<RawCollection>[] } }>(`query Collections($first: Int!) { collections(first: $first) { edges { node { id handle title description image { ${IMAGE} } } } } }`, { first }); return data.collections.edges.map(({ node }) => collection(node)); }),
  getCollection: cache(async (handle) => { const data = await storefrontRequest<{ collection: RawCollection | null }>(`query Collection($handle: String!) { collection(handle: $handle) { id handle title description image { ${IMAGE} } } }`, { handle }); return data.collection ? collection(data.collection) : null; }),
  createCart: async (lines) => { const data = await storefrontRequest<{ cartCreate: { cart: RawCart | null; userErrors: { message: string }[] } }>(`mutation CreateCart($input: CartInput!) { cartCreate(input: $input) { cart { ${CART_FIELDS} } userErrors { message } } }`, { input: { lines: lines.map(({ variantId, quantity }) => ({ merchandiseId: variantId, quantity })) } }); return ensureCart(data.cartCreate); },
  getCart: async (cartId) => { const data = await storefrontRequest<{ cart: RawCart | null }>(`query Cart($cartId: ID!) { cart(id: $cartId) { ${CART_FIELDS} } }`, { cartId }); return data.cart ? cart(data.cart) : null; },
  addToCart: async (cartId, lines) => { const data = await storefrontRequest<{ cartLinesAdd: { cart: RawCart | null; userErrors: { message: string }[] } }>(`mutation AddLines($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } } }`, { cartId, lines: lines.map(({ variantId, quantity }) => ({ merchandiseId: variantId, quantity })) }); return ensureCart(data.cartLinesAdd); },
  updateCart: async (cartId, lines) => { const data = await storefrontRequest<{ cartLinesUpdate: { cart: RawCart | null; userErrors: { message: string }[] } }>(`mutation UpdateLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } } }`, { cartId, lines }); return ensureCart(data.cartLinesUpdate); },
  removeFromCart: async (cartId, lineIds) => { const data = await storefrontRequest<{ cartLinesRemove: { cart: RawCart | null; userErrors: { message: string }[] } }>(`mutation RemoveLines($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { message } } }`, { cartId, lineIds }); return ensureCart(data.cartLinesRemove); },
  getProductDocumentation: documentationForProduct,
  getCOAs: cache(async () => {
    const identifiers = configuredProductMetafields(); if (!identifiers.length) return [];
    const data = await storefrontRequest<{ products: { edges: RawEdge<{ handle: string; title: string; metafields: Array<RawMetafield | null> }>[] } }>(`query CoaProducts($identifiers: [HasMetafieldsIdentifier!]!) { products(first: 100, sortKey: TITLE) { edges { node { handle title metafields(identifiers: $identifiers) { namespace key value reference { ... on Metaobject { type fields { key value } } } } } } } }`, { identifiers });
    return data.products.edges.flatMap(({ node }) => documentation(node.handle, node.title, node.metafields)?.coa ?? []);
  }),
};
