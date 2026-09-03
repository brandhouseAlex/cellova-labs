import type {
  CommerceAuthInput,
  CommerceAuthResult,
  CommerceCart,
  CommerceCartItem,
  CommerceCertificateOfAnalysis,
  CommerceCollection,
  CommerceCustomer,
  CommerceImage,
  CommerceMoney,
  CommerceOrder,
  CommercePaginatedResult,
  CommerceProduct,
  CommerceProductQuery,
  CommerceProvider,
  CommerceRegisterInput,
  CommerceVariant,
} from "@/lib/commerce/types";
import { commerceConfig } from "@/lib/commerce/config";

/**
 * Shopify Storefront API provider.
 *
 * This adapter uses only the Storefront public access token configured by:
 * - NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
 * - NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
 * - NEXT_PUBLIC_SHOPIFY_API_VERSION
 *
 * No Admin API credential is read, transmitted, or required. Product and cart
 * results are normalized before the rest of the storefront sees them.
 */

const STOREFRONT_TOKEN_HEADER = "X-Shopify-Storefront-Access-Token";
const CONNECTION_PAGE_SIZE = 50;
const MAX_CONNECTION_REQUESTS = 40;

type ShopifyMoney = { amount: string; currencyCode: string };

type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

type ShopifyEdge<T> = { cursor: string; node: T };

type ShopifyConnection<T> = {
  edges: Array<ShopifyEdge<T>>;
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
};

type ShopifySeo = { title: string | null; description: string | null };

type ShopifyMetaobjectField = {
  key: string;
  value: string | null;
  reference: { url?: string | null; mimeType?: string | null } | null;
};

type ShopifyCoaMetaobject = {
  id: string;
  fields: ShopifyMetaobjectField[];
};

type ShopifyCoaProductMetafield = {
  type: string;
  reference: ShopifyCoaMetaobject | null;
  references: ShopifyConnection<ShopifyCoaMetaobject> | null;
};

type ShopifyProductVariant = {
  id: string;
  title: string;
  sku: string | null;
  availableForSale: boolean;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  selectedOptions: Array<{ name: string; value: string }>;
  image: ShopifyImage | null;
};

type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  vendor: string;
  createdAt: string;
  updatedAt: string;
  seo: ShopifySeo;
  featuredImage: ShopifyImage | null;
  images: ShopifyConnection<ShopifyImage>;
  options: Array<{ id: string; name: string; values: string[] }>;
  variants: ShopifyConnection<ShopifyProductVariant>;
  priceRange: { minVariantPrice: ShopifyMoney; maxVariantPrice: ShopifyMoney };
  collections: ShopifyConnection<{ handle: string }>;
  coaMetafield: ShopifyCoaProductMetafield | null;
};

type ShopifyCollection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  updatedAt: string;
  seo: ShopifySeo;
  image: ShopifyImage | null;
};

type ShopifyCartLine = {
  id: string;
  quantity: number;
  cost: { amountPerQuantity: ShopifyMoney; totalAmount: ShopifyMoney };
  merchandise: ShopifyProductVariant & {
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: ShopifyImage | null;
    };
  };
};

type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: ShopifyConnection<ShopifyCartLine>;
  discountAllocations: Array<{ discountedAmount: ShopifyMoney }>;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
    totalTaxAmount: ShopifyMoney | null;
  };
};

type ShopifyUserError = {
  message: string;
  field?: string[] | null;
  code?: string | null;
};

type ShopifyCartMutationPayload = {
  cart: ShopifyCart | null;
  userErrors: ShopifyUserError[];
  warnings?: Array<{ message: string }>;
};

type GraphQLError = {
  message: string;
  path?: Array<string | number>;
  extensions?: { code?: string };
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLError[];
};

class ShopifyStorefrontError extends Error {
  readonly name = "ShopifyStorefrontError";

  constructor(message: string, readonly cause?: unknown) {
    super(message);
  }
}

function normalizeStoreDomain(rawDomain: string | undefined): string {
  const domain = rawDomain?.trim().replace(/^https?:\/\//i, "").replace(/\/+$/, "");
  if (!domain) {
    throw new ShopifyStorefrontError(
      "[commerce] Shopify is selected but NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not set."
    );
  }
  if (domain.includes("/") || domain.includes("?")) {
    throw new ShopifyStorefrontError(
      "[commerce] NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN must contain only a Shopify domain, for example store-name.myshopify.com."
    );
  }
  return domain;
}

function storefrontEndpoint(): { url: string; token: string } {
  const domain = normalizeStoreDomain(commerceConfig.shopify.storeDomain);
  const token = commerceConfig.shopify.storefrontToken?.trim();
  const apiVersion = commerceConfig.shopify.apiVersion?.trim();

  if (!token) {
    throw new ShopifyStorefrontError(
      "[commerce] Shopify is selected but NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN is not set. Create a Storefront public access token with product and cart access."
    );
  }
  if (!apiVersion || !/^\d{4}-\d{2}$/.test(apiVersion)) {
    throw new ShopifyStorefrontError(
      "[commerce] NEXT_PUBLIC_SHOPIFY_API_VERSION must use the YYYY-MM format, for example 2025-01."
    );
  }

  return {
    url: `https://${domain}/api/${apiVersion}/graphql.json`,
    token,
  };
}

function describeGraphQLErrors(errors: GraphQLError[]): string {
  return errors
    .map((error) => {
      const path = error.path?.length ? ` at ${error.path.join(".")}` : "";
      const code = error.extensions?.code ? ` (${error.extensions.code})` : "";
      return `${error.message}${code}${path}`;
    })
    .join("; ");
}

async function storefront<T>(
  operation: string,
  query: string,
  variables: Record<string, unknown> = {},
  options: { revalidate?: number; cache?: RequestCache } = {
    revalidate: 300,
  }
): Promise<T> {
  const { url, token } = storefrontEndpoint();
  let response: Response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [STOREFRONT_TOKEN_HEADER]: token,
      },
      body: JSON.stringify({ query, variables }),
      ...(options.cache ? { cache: options.cache } : {}),
      ...(options.revalidate !== undefined
        ? { next: { revalidate: options.revalidate } }
        : {}),
    });
  } catch (error) {
    throw new ShopifyStorefrontError(
      `[commerce] Shopify Storefront API request failed during ${operation}. Verify the store domain, Storefront token, network availability, and API version.`,
      error
    );
  }

  const payload = (await response.json().catch(() => null)) as GraphQLResponse<T> | null;

  if (!response.ok) {
    const detail = payload?.errors?.length
      ? ` ${describeGraphQLErrors(payload.errors)}`
      : "";
    throw new ShopifyStorefrontError(
      `[commerce] Shopify Storefront API ${operation} request returned HTTP ${response.status}.${detail}`
    );
  }

  if (!payload) {
    throw new ShopifyStorefrontError(
      `[commerce] Shopify Storefront API ${operation} returned an invalid JSON response.`
    );
  }
  if (payload.errors?.length) {
    throw new ShopifyStorefrontError(
      `[commerce] Shopify Storefront API ${operation} GraphQL error: ${describeGraphQLErrors(payload.errors)}`
    );
  }
  if (!payload.data) {
    throw new ShopifyStorefrontError(
      `[commerce] Shopify Storefront API ${operation} returned no data.`
    );
  }

  return payload.data;
}

function assertUserErrors(operation: string, errors: ShopifyUserError[]): void {
  if (!errors.length) return;
  const detail = errors
    .map((error) => {
      const code = error.code ? ` (${error.code})` : "";
      const field = error.field?.length ? ` at ${error.field.join(".")}` : "";
      return `${error.message}${code}${field}`;
    })
    .join("; ");
  throw new ShopifyStorefrontError(
    `[commerce] Shopify Storefront API ${operation} rejected the request: ${detail}`
  );
}

function normalizeMoney(money: ShopifyMoney): CommerceMoney {
  return { amount: money.amount, currencyCode: money.currencyCode };
}

function normalizeImage(
  image: ShopifyImage | null | undefined,
  fallbackAlt: string
): CommerceImage | null {
  if (!image) return null;
  return {
    url: image.url,
    altText: image.altText?.trim() || fallbackAlt,
    ...(image.width ? { width: image.width } : {}),
    ...(image.height ? { height: image.height } : {}),
  };
}

function normalizeVariant(variant: ShopifyProductVariant): CommerceVariant {
  return {
    id: variant.id,
    title: variant.title,
    sku: variant.sku,
    availableForSale: variant.availableForSale,
    price: normalizeMoney(variant.price),
    compareAtPrice: variant.compareAtPrice
      ? normalizeMoney(variant.compareAtPrice)
      : null,
    selectedOptions: Object.fromEntries(
      variant.selectedOptions.map((option) => [option.name, option.value])
    ),
  };
}

const COA_FIELD_KEY_ALIASES = {
  productName: ["product_name", "product-name", "productname"],
  lotNumber: ["lot_number", "lot-number", "lotnumber"],
  testedDate: ["tested_date", "tested-date", "testeddate"],
  laboratory: ["laboratory"],
  identityMs: ["identity_ms", "identity-ms", "identityms"],
  purityHplc: ["purity_hplc", "purity-hplc", "purityhplc"],
  netContent: ["net_content", "net-content", "netcontent"],
  endotoxin: ["endotoxin"],
  heavyMetals: ["heavy_metals", "heavy-metals", "heavymetals"],
  pdf: ["coa_pdf", "coa-pdf", "coapdf"],
} as const;

function fieldFor(
  fields: ShopifyMetaobjectField[],
  aliases: readonly string[]
): ShopifyMetaobjectField | undefined {
  return fields.find((field) => aliases.includes(field.key.toLowerCase()));
}

function textFromField(field: ShopifyMetaobjectField | undefined): string | undefined {
  const value = field?.value?.trim();
  return value || undefined;
}

function filenameFromUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const name = new URL(url).pathname.split("/").pop();
    return name ? decodeURIComponent(name) : undefined;
  } catch {
    return undefined;
  }
}

function normalizeCoas(
  coaMetafield: ShopifyCoaProductMetafield | null
): CommerceCertificateOfAnalysis[] {
  if (!coaMetafield) return [];
  const entries = [
    ...(coaMetafield.reference ? [coaMetafield.reference] : []),
    ...(coaMetafield.references?.edges.map(({ node }) => node) ?? []),
  ].filter((entry, index, all) => all.findIndex((candidate) => candidate.id === entry.id) === index);

  return entries
    .map((entry) => {
      const pdfField = fieldFor(entry.fields, COA_FIELD_KEY_ALIASES.pdf);
      const pdfUrl = pdfField?.reference?.url ?? (
        textFromField(pdfField)?.match(/^https?:\/\//i) ? textFromField(pdfField) : undefined
      );
      const coa: CommerceCertificateOfAnalysis = {
        productName: textFromField(fieldFor(entry.fields, COA_FIELD_KEY_ALIASES.productName)),
        lotNumber: textFromField(fieldFor(entry.fields, COA_FIELD_KEY_ALIASES.lotNumber)),
        testedDate: textFromField(fieldFor(entry.fields, COA_FIELD_KEY_ALIASES.testedDate)),
        laboratory: textFromField(fieldFor(entry.fields, COA_FIELD_KEY_ALIASES.laboratory)),
        identityMs: textFromField(fieldFor(entry.fields, COA_FIELD_KEY_ALIASES.identityMs)),
        purityHplc: textFromField(fieldFor(entry.fields, COA_FIELD_KEY_ALIASES.purityHplc)),
        netContent: textFromField(fieldFor(entry.fields, COA_FIELD_KEY_ALIASES.netContent)),
        endotoxin: textFromField(fieldFor(entry.fields, COA_FIELD_KEY_ALIASES.endotoxin)),
        heavyMetals: textFromField(fieldFor(entry.fields, COA_FIELD_KEY_ALIASES.heavyMetals)),
        ...(pdfUrl ? { pdfUrl, pdfName: filenameFromUrl(pdfUrl) } : {}),
      };
      return Object.values(coa).some(Boolean) ? coa : undefined;
    })
    .filter((coa): coa is CommerceCertificateOfAnalysis => Boolean(coa))
    .sort((a, b) => {
      const aDate = a.testedDate ? Date.parse(a.testedDate) : Number.NEGATIVE_INFINITY;
      const bDate = b.testedDate ? Date.parse(b.testedDate) : Number.NEGATIVE_INFINITY;
      return bDate - aDate;
    });
}

function normalizeProduct(product: ShopifyProduct): CommerceProduct {
  const featuredImage = normalizeImage(product.featuredImage, product.title);
  const variants = product.variants.edges.map(({ node }) => normalizeVariant(node));
  const coas = normalizeCoas(product.coaMetafield);
  const coa = coas[0];

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    productType: product.productType,
    tags: product.tags,
    vendor: product.vendor || undefined,
    featuredImage,
    images: product.images.edges
      .map(({ node }) => normalizeImage(node, product.title))
      .filter((image): image is CommerceImage => image !== null),
    options: product.options.map((option) => ({
      id: option.id,
      name: option.name,
      values: option.values,
    })),
    variants,
    priceRange: {
      minVariantPrice: normalizeMoney(product.priceRange.minVariantPrice),
      maxVariantPrice: normalizeMoney(product.priceRange.maxVariantPrice),
    },
    collections: product.collections.edges.map(({ node }) => node.handle),
    ...(coa
      ? {
          coas,
          coa,
          specs: {
            ...(coa.lotNumber ? { batchLot: coa.lotNumber } : {}),
            ...(coa.purityHplc ? { purity: coa.purityHplc } : {}),
            ...(coa.pdfUrl ? { coa: coa.pdfUrl } : {}),
          },
        }
      : {}),
    seo: {
      ...(product.seo.title ? { title: product.seo.title } : {}),
      ...(product.seo.description ? { description: product.seo.description } : {}),
    },
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function normalizeCollection(collection: ShopifyCollection): CommerceCollection {
  return {
    id: collection.id,
    handle: collection.handle,
    title: collection.title,
    description: collection.description,
    image: normalizeImage(collection.image, collection.title),
    seo: {
      ...(collection.seo.title ? { title: collection.seo.title } : {}),
      ...(collection.seo.description ? { description: collection.seo.description } : {}),
    },
    updatedAt: collection.updatedAt,
  };
}

function normalizeCart(cart: ShopifyCart): CommerceCart {
  const items: CommerceCartItem[] = cart.lines.edges.map(({ node: line }) => {
    const product = line.merchandise.product;
    return {
      id: line.id,
      cartId: cart.id,
      productId: product.id,
      productHandle: product.handle,
      productTitle: product.title,
      variantId: line.merchandise.id,
      variantTitle: line.merchandise.title,
      quantity: line.quantity,
      price: normalizeMoney(line.cost.amountPerQuantity),
      lineTotal: normalizeMoney(line.cost.totalAmount),
      image:
        normalizeImage(line.merchandise.image, product.title) ??
        normalizeImage(product.featuredImage, product.title),
    };
  });

  const currencyCode = cart.cost.totalAmount.currencyCode;
  const discountTotal = cart.discountAllocations.reduce(
    (sum, allocation) => sum + Number(allocation.discountedAmount.amount || 0),
    0
  );

  return {
    id: cart.id,
    items,
    subtotal: normalizeMoney(cart.cost.subtotalAmount),
    discountTotal: {
      amount: discountTotal.toFixed(2),
      currencyCode,
    },
    // Shipping rates are finalized by Shopify checkout after the delivery address.
    estimatedShipping: null,
    estimatedTaxes: cart.cost.totalTaxAmount
      ? normalizeMoney(cart.cost.totalTaxAmount)
      : null,
    total: normalizeMoney(cart.cost.totalAmount),
    totalQuantity: cart.totalQuantity,
    checkoutUrl: cart.checkoutUrl,
  };
}

function sortProducts(
  products: CommerceProduct[],
  sort: CommerceProductQuery["sort"]
): CommerceProduct[] {
  const list = [...products];
  switch (sort) {
    case "newest":
      return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    case "price-asc":
      return list.sort(
        (a, b) =>
          Number(a.priceRange.minVariantPrice.amount) -
          Number(b.priceRange.minVariantPrice.amount)
      );
    case "price-desc":
      return list.sort(
        (a, b) =>
          Number(b.priceRange.minVariantPrice.amount) -
          Number(a.priceRange.minVariantPrice.amount)
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

function matchesLocalProductFilters(
  product: CommerceProduct,
  query: CommerceProductQuery
): boolean {
  if (query.productType && product.productType !== query.productType) return false;
  if (!query.query?.trim()) return true;
  const search = query.query.toLowerCase().trim();
  return (
    product.title.toLowerCase().includes(search) ||
    product.description.toLowerCase().includes(search) ||
    product.tags.some((tag) => tag.toLowerCase().includes(search))
  );
}

function buildShopifySearch(query: CommerceProductQuery): string | null {
  const clauses: string[] = [];
  if (query.query?.trim()) clauses.push(query.query.trim());
  if (query.productType?.trim()) {
    const escapedType = query.productType.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    clauses.push(`product_type:"${escapedType}"`);
  }
  return clauses.length ? clauses.join(" AND ") : null;
}

const PRODUCT_LIST_FIELDS = `
  id
  handle
  title
  description
  descriptionHtml
  productType
  tags
  vendor
  createdAt
  updatedAt
  seo { title description }
  featuredImage { url altText width height }
  images(first: 8) { edges { cursor node { url altText width height } } pageInfo { hasNextPage endCursor } }
  options { id name values }
  variants(first: 20) {
    edges {
      cursor
      node {
        id title sku availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        selectedOptions { name value }
        image { url altText width height }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
  priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
  collections(first: 50) { edges { cursor node { handle } } pageInfo { hasNextPage endCursor } }
  coaMetafield: metafield(namespace: "custom", key: "coas") {
    type
    reference {
      ... on Metaobject {
        id
        fields {
          key value
          reference { ... on GenericFile { url mimeType } }
        }
      }
    }
    references(first: 50) {
      edges {
        node {
          ... on Metaobject {
            id
            fields {
              key value
              reference { ... on GenericFile { url mimeType } }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_DETAIL_FIELDS = PRODUCT_LIST_FIELDS.replace(
  "images(first: 8)",
  "images(first: 50)"
).replace("variants(first: 20)", "variants(first: 100)");

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  lines(first: 250) {
    edges {
      cursor
      node {
        id
        quantity
        cost {
          amountPerQuantity { amount currencyCode }
          totalAmount { amount currencyCode }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            image { url altText width height }
            product {
              id
              handle
              title
              featuredImage { url altText width height }
            }
          }
        }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
  discountAllocations { discountedAmount { amount currencyCode } }
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
    totalTaxAmount { amount currencyCode }
  }
`;

async function fetchAllProducts(search: string | null): Promise<ShopifyProduct[]> {
  const products: ShopifyProduct[] = [];
  let after: string | null = null;

  for (let request = 0; request < MAX_CONNECTION_REQUESTS; request += 1) {
    const data: { products: ShopifyConnection<ShopifyProduct> } = await storefront<{
      products: ShopifyConnection<ShopifyProduct>;
    }>(
      "products",
      `query Products($first: Int!, $after: String, $query: String) {
        products(first: $first, after: $after, query: $query) {
          edges { cursor node { ${PRODUCT_LIST_FIELDS} } }
          pageInfo { hasNextPage endCursor }
        }
      }`,
      { first: CONNECTION_PAGE_SIZE, after, query: search }
    );
    products.push(
      ...data.products.edges.map(
        ({ node }: ShopifyEdge<ShopifyProduct>) => node
      )
    );
    if (!data.products.pageInfo.hasNextPage) return products;
    after = data.products.pageInfo.endCursor;
    if (!after) break;
  }

  throw new ShopifyStorefrontError(
    `[commerce] Shopify product connection exceeded ${MAX_CONNECTION_REQUESTS} requests. Narrow the product query or increase the provider safety limit.`
  );
}

async function fetchAllCollectionProducts(handle: string): Promise<ShopifyProduct[] | null> {
  const products: ShopifyProduct[] = [];
  let after: string | null = null;

  for (let request = 0; request < MAX_CONNECTION_REQUESTS; request += 1) {
    const data: {
      collection: (ShopifyCollection & {
        products: ShopifyConnection<ShopifyProduct>;
      }) | null;
    } = await storefront<{
      collection: (ShopifyCollection & {
        products: ShopifyConnection<ShopifyProduct>;
      }) | null;
    }>(
      "collection products",
      `query CollectionProducts($handle: String!, $first: Int!, $after: String) {
        collection(handle: $handle) {
          products(first: $first, after: $after) {
            edges { cursor node { ${PRODUCT_LIST_FIELDS} } }
            pageInfo { hasNextPage endCursor }
          }
        }
      }`,
      { handle, first: CONNECTION_PAGE_SIZE, after }
    );

    if (!data.collection) return null;
    products.push(
      ...data.collection.products.edges.map(
        ({ node }: ShopifyEdge<ShopifyProduct>) => node
      )
    );
    if (!data.collection.products.pageInfo.hasNextPage) return products;
    after = data.collection.products.pageInfo.endCursor;
    if (!after) break;
  }

  throw new ShopifyStorefrontError(
    `[commerce] Shopify collection "${handle}" exceeded ${MAX_CONNECTION_REQUESTS} product requests. Narrow the collection or increase the provider safety limit.`
  );
}

async function mutateCart(
  operation: string,
  query: string,
  variables: Record<string, unknown>,
  payloadKey: "cartCreate" | "cartLinesAdd" | "cartLinesUpdate" | "cartLinesRemove"
): Promise<CommerceCart> {
  const data = await storefront<Record<typeof payloadKey, ShopifyCartMutationPayload>>(
    operation,
    query,
    variables,
    { cache: "no-store" }
  );
  const payload = data[payloadKey];
  assertUserErrors(operation, payload.userErrors);
  if (!payload.cart) {
    throw new ShopifyStorefrontError(
      `[commerce] Shopify Storefront API ${operation} returned no cart and no user error.`
    );
  }
  return normalizeCart(payload.cart);
}

function customerAccountUnavailable(operation: string): ShopifyStorefrontError {
  return new ShopifyStorefrontError(
    `[commerce] Shopify ${operation} requires the Shopify Customer Account API OAuth flow. This provider intentionally uses only the Storefront public token for catalog, cart, and hosted checkout; it does not use or expose Admin API credentials.`
  );
}

export const shopifyProvider: CommerceProvider = {
  name: "shopify",

  async getProducts(
    query: CommerceProductQuery = {}
  ): Promise<CommercePaginatedResult<CommerceProduct>> {
    const rawProducts = query.collection
      ? await fetchAllCollectionProducts(query.collection)
      : await fetchAllProducts(buildShopifySearch(query));

    if (rawProducts === null) {
      const perPage = Math.max(1, query.perPage ?? 12);
      return { items: [], total: 0, page: Math.max(1, query.page ?? 1), perPage, totalPages: 1 };
    }

    const filtered = sortProducts(
      rawProducts.map(normalizeProduct).filter((product) => matchesLocalProductFilters(product, query)),
      query.sort
    );
    const perPage = Math.max(1, query.perPage ?? 12);
    const page = Math.max(1, query.page ?? 1);
    const total = filtered.length;

    return {
      items: filtered.slice((page - 1) * perPage, page * perPage),
      total,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    };
  },

  async getProductByHandle(handle: string): Promise<CommerceProduct | null> {
    const data = await storefront<{ product: ShopifyProduct | null }>(
      "productByHandle",
      `query ProductByHandle($handle: String!) {
        product(handle: $handle) { ${PRODUCT_DETAIL_FIELDS} }
      }`,
      { handle }
    );
    return data.product ? normalizeProduct(data.product) : null;
  },

  async getCollections(): Promise<CommerceCollection[]> {
    const collections: ShopifyCollection[] = [];
    let after: string | null = null;

    for (let request = 0; request < MAX_CONNECTION_REQUESTS; request += 1) {
      const data: { collections: ShopifyConnection<ShopifyCollection> } = await storefront<{
        collections: ShopifyConnection<ShopifyCollection>;
      }>(
        "collections",
        `query Collections($first: Int!, $after: String) {
          collections(first: $first, after: $after) {
            edges {
              cursor
              node {
                id handle title description updatedAt
                seo { title description }
                image { url altText width height }
              }
            }
            pageInfo { hasNextPage endCursor }
          }
        }`,
        { first: CONNECTION_PAGE_SIZE, after }
      );
      collections.push(
        ...data.collections.edges.map(
          ({ node }: ShopifyEdge<ShopifyCollection>) => node
        )
      );
      if (!data.collections.pageInfo.hasNextPage) return collections.map(normalizeCollection);
      after = data.collections.pageInfo.endCursor;
      if (!after) break;
    }

    throw new ShopifyStorefrontError(
      `[commerce] Shopify collection connection exceeded ${MAX_CONNECTION_REQUESTS} requests. Increase the provider safety limit.`
    );
  },

  async getCollectionByHandle(handle: string): Promise<CommerceCollection | null> {
    const data = await storefront<{ collection: ShopifyCollection | null }>(
      "collectionByHandle",
      `query CollectionByHandle($handle: String!) {
        collection(handle: $handle) {
          id handle title description updatedAt
          seo { title description }
          image { url altText width height }
        }
      }`,
      { handle }
    );
    return data.collection ? normalizeCollection(data.collection) : null;
  },

  async getProductTypes(): Promise<string[]> {
    const { items } = await shopifyProvider.getProducts({ perPage: 250 });
    return Array.from(new Set(items.map((product) => product.productType).filter(Boolean))).sort();
  },

  async createCart(): Promise<CommerceCart> {
    return mutateCart(
      "cartCreate",
      `mutation CartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart { ${CART_FIELDS} }
          userErrors { field message code }
          warnings { message }
        }
      }`,
      { input: {} },
      "cartCreate"
    );
  },

  async getCart(cartId: string): Promise<CommerceCart | null> {
    const data = await storefront<{ cart: ShopifyCart | null }>(
      "cart",
      `query Cart($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`,
      { id: cartId }
    );
    return data.cart ? normalizeCart(data.cart) : null;
  },

  async addCartItem(
    cartId: string,
    input: { variantId: string; quantity: number }
  ): Promise<CommerceCart> {
    if (!input.variantId) {
      throw new ShopifyStorefrontError("[commerce] A Shopify variant ID is required to add an item to cart.");
    }
    if (!Number.isInteger(input.quantity) || input.quantity < 1) {
      throw new ShopifyStorefrontError("[commerce] Cart item quantity must be a positive integer.");
    }
    return mutateCart(
      "cartLinesAdd",
      `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { ${CART_FIELDS} }
          userErrors { field message code }
          warnings { message }
        }
      }`,
      { cartId, lines: [{ merchandiseId: input.variantId, quantity: input.quantity }] },
      "cartLinesAdd"
    );
  },

  async updateCartItem(cartId: string, lineId: string, quantity: number): Promise<CommerceCart> {
    if (!Number.isInteger(quantity)) {
      throw new ShopifyStorefrontError("[commerce] Cart item quantity must be an integer.");
    }
    if (quantity <= 0) return shopifyProvider.removeCartItem(cartId, lineId);
    return mutateCart(
      "cartLinesUpdate",
      `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart { ${CART_FIELDS} }
          userErrors { field message code }
          warnings { message }
        }
      }`,
      { cartId, lines: [{ id: lineId, quantity }] },
      "cartLinesUpdate"
    );
  },

  async removeCartItem(cartId: string, lineId: string): Promise<CommerceCart> {
    return mutateCart(
      "cartLinesRemove",
      `mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart { ${CART_FIELDS} }
          userErrors { field message code }
          warnings { message }
        }
      }`,
      { cartId, lineIds: [lineId] },
      "cartLinesRemove"
    );
  },

  // Shopify customer account data uses Customer Account API OAuth, not the
  // public Storefront token intentionally used by this provider.
  async login(_input: CommerceAuthInput): Promise<CommerceAuthResult> {
    return {
      success: false,
      error: customerAccountUnavailable("customer sign-in").message,
    };
  },

  async register(_input: CommerceRegisterInput): Promise<CommerceAuthResult> {
    return {
      success: false,
      error: customerAccountUnavailable("customer registration").message,
    };
  },

  async logout(): Promise<void> {
    // Storefront carts are anonymous; customer sessions are not created here.
  },

  async getCustomer(_token: string): Promise<CommerceCustomer | null> {
    throw customerAccountUnavailable("customer lookup");
  },

  async getOrders(_token: string): Promise<CommerceOrder[]> {
    throw customerAccountUnavailable("order lookup");
  },

  async getOrderById(_token: string, _orderId: string): Promise<CommerceOrder | null> {
    throw customerAccountUnavailable("order lookup");
  },
};
