/**
 * Cellova Labs — Normalized Commerce Types
 *
 * These are the ONLY commerce types UI components are allowed to consume.
 * Every provider (mock, Medusa, Shopify) must transform its native API
 * responses into these shapes before data reaches the UI layer.
 */

/* ------------------------------------------------------------------ */
/* Money & Images                                                      */
/* ------------------------------------------------------------------ */

export interface CommerceMoney {
  /** Decimal amount as a string to avoid floating point drift, e.g. "49.00" */
  amount: string;
  /** ISO 4217 currency code, e.g. "USD" */
  currencyCode: string;
}

export interface CommerceImage {
  url: string;
  altText: string;
  width?: number;
  height?: number;
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

export interface CommerceProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface CommerceVariant {
  id: string;
  title: string;
  sku: string | null;
  availableForSale: boolean;
  price: CommerceMoney;
  compareAtPrice?: CommerceMoney | null;
  /** Maps option name -> selected value, e.g. { "Strength": "5 mg" } */
  selectedOptions: Record<string, string>;
}

/** Structured, research-oriented specification fields. */
export interface CommerceProductSpecs {
  sku?: string;
  sequence?: string;
  molecularFormula?: string;
  molecularWeight?: string;
  purity?: string;
  form?: string;
  storage?: string;
  /** URL or identifier of a Certificate of Analysis. Omit entirely if none exists. */
  coa?: string | null;
  batchLot?: string;
}

/** Public, batch-level Certificate of Analysis metadata from the active provider. */
export interface CommerceCertificateOfAnalysis {
  productName?: string;
  lotNumber?: string;
  testedDate?: string;
  laboratory?: string;
  identityMs?: string;
  purityHplc?: string;
  netContent?: string;
  endotoxin?: string;
  heavyMetals?: string;
  /** Public URL to the provider-hosted COA PDF, when supplied. */
  pdfUrl?: string;
  /** Display filename derived from the provider-hosted public PDF URL. */
  pdfName?: string;
}

export interface CommerceProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  productType: string;
  tags: string[];
  vendor?: string;
  featuredImage: CommerceImage | null;
  images: CommerceImage[];
  options: CommerceProductOption[];
  variants: CommerceVariant[];
  priceRange: {
    minVariantPrice: CommerceMoney;
    maxVariantPrice: CommerceMoney;
  };
  /** Handles of collections this product belongs to. */
  collections: string[];
  specs?: CommerceProductSpecs;
  /** Available batch records sorted newest-first by the active provider. */
  coas?: CommerceCertificateOfAnalysis[];
  /** Newest available COA retained for compatibility with existing surfaces. */
  coa?: CommerceCertificateOfAnalysis;
  seo?: {
    title?: string;
    description?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

/* ------------------------------------------------------------------ */
/* Collections                                                         */
/* ------------------------------------------------------------------ */

export interface CommerceCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: CommerceImage | null;
  seo?: {
    title?: string;
    description?: string;
  };
  updatedAt?: string;
}

/* ------------------------------------------------------------------ */
/* Cart                                                                */
/* ------------------------------------------------------------------ */

export interface CommerceCartItem {
  id: string;
  cartId: string;
  productId: string;
  productHandle: string;
  productTitle: string;
  variantId: string;
  variantTitle: string;
  quantity: number;
  price: CommerceMoney;
  lineTotal: CommerceMoney;
  image: CommerceImage | null;
}

export interface CommerceCart {
  id: string;
  items: CommerceCartItem[];
  /** Sum of line totals before discounts/shipping/taxes. */
  subtotal: CommerceMoney;
  /** Total of applied discounts (0.00 when none). */
  discountTotal: CommerceMoney;
  /** Estimated shipping, when the provider can supply it. */
  estimatedShipping?: CommerceMoney | null;
  /** Estimated taxes, when the provider can supply it. */
  estimatedTaxes?: CommerceMoney | null;
  total: CommerceMoney;
  totalQuantity: number;
  /** Provider-hosted checkout URL, when available (e.g. Shopify web checkout). */
  checkoutUrl?: string | null;
}

/* ------------------------------------------------------------------ */
/* Customer & Auth                                                     */
/* ------------------------------------------------------------------ */

export interface CommerceAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface CommerceCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  /** Organization supplied during research-network registration. */
  companyName?: string | null;
  /** Recorded by providers able to persist research-use consent. */
  researchUseConsent?: {
    accepted: boolean;
    version: string;
    acceptedAt: string;
  } | null;
  acceptsMarketing?: boolean;
  defaultAddress?: CommerceAddress | null;
  createdAt: string;
}

export interface CommerceAuthInput {
  email: string;
  password: string;
}

export interface CommerceRegisterInput extends CommerceAuthInput {
  firstName: string;
  lastName: string;
  phone?: string;
  companyName?: string;
  /** Required research-use + age acknowledgement captured at registration. */
  acceptsResearchUseTerms: boolean;
  researchUseConsentVersion?: string;
}

export interface CommerceAuthResult {
  success: boolean;
  customer?: CommerceCustomer;
  error?: string;
}

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */

export type CommerceOrderStatus =
  | "pending"
  | "processing"
  | "fulfilled"
  | "partially_fulfilled"
  | "cancelled"
  | "refunded";

export interface CommerceOrderItem {
  id: string;
  productTitle: string;
  variantTitle: string;
  quantity: number;
  price: CommerceMoney;
  lineTotal: CommerceMoney;
  image: CommerceImage | null;
}

export interface CommerceOrder {
  id: string;
  orderNumber: string;
  status: CommerceOrderStatus;
  email: string;
  items: CommerceOrderItem[];
  subtotal: CommerceMoney;
  shippingTotal: CommerceMoney;
  taxTotal: CommerceMoney;
  discountTotal: CommerceMoney;
  total: CommerceMoney;
  shippingAddress?: CommerceAddress | null;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/* Catalog query inputs                                                */
/* ------------------------------------------------------------------ */

export type CommerceSortKey =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "alphabetical"
  | "alphabetical-desc";

export interface CommerceProductQuery {
  /** Full-text-ish search against title/description/tags. */
  query?: string;
  /** Restrict to a collection handle. */
  collection?: string;
  /** Restrict to a product type. */
  productType?: string;
  sort?: CommerceSortKey;
  /** 1-based page number. */
  page?: number;
  /** Page size. */
  perPage?: number;
}

export interface CommercePaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

/* ------------------------------------------------------------------ */
/* Provider interface                                                  */
/* ------------------------------------------------------------------ */

/**
 * The single contract every commerce backend adapter must satisfy.
 * UI code imports `commerce` from `lib/commerce` and never touches
 * provider SDKs directly.
 */
export interface CommerceProvider {
  readonly name: string;

  /* Catalog */
  getProducts(
    query?: CommerceProductQuery
  ): Promise<CommercePaginatedResult<CommerceProduct>>;
  getProductByHandle(handle: string): Promise<CommerceProduct | null>;
  getCollections(): Promise<CommerceCollection[]>;
  getCollectionByHandle(handle: string): Promise<CommerceCollection | null>;
  getProductTypes(): Promise<string[]>;

  /* Cart */
  createCart(): Promise<CommerceCart>;
  getCart(cartId: string): Promise<CommerceCart | null>;
  addCartItem(
    cartId: string,
    input: { variantId: string; quantity: number }
  ): Promise<CommerceCart>;
  updateCartItem(
    cartId: string,
    lineId: string,
    quantity: number
  ): Promise<CommerceCart>;
  removeCartItem(cartId: string, lineId: string): Promise<CommerceCart>;

  /* Auth & customer */
  login(input: CommerceAuthInput): Promise<CommerceAuthResult>;
  register(input: CommerceRegisterInput): Promise<CommerceAuthResult>;
  logout(): Promise<void>;
  getCustomer(token: string): Promise<CommerceCustomer | null>;

  /* Orders */
  getOrders(token: string): Promise<CommerceOrder[]>;
  getOrderById(token: string, orderId: string): Promise<CommerceOrder | null>;
}
