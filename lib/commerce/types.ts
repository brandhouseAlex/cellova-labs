export type Money = { amount: string; currencyCode: string };

export type ProductImage = { url: string; altText: string | null; width?: number; height?: number };

export type ProductVariant = {
  id: string;
  title: string;
  price: Money;
  compareAtPrice: Money | null;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  productType: string | null;
  vendor: string | null;
  tags: string[];
  images: ProductImage[];
  priceRange: { min: Money; max: Money };
  options: { name: string; values: string[] }[];
  variants: ProductVariant[];
};

export type Collection = { id: string; handle: string; title: string; description: string; image: ProductImage | null };

export type CartItem = {
  lineId: string;
  variantId: string;
  productHandle: string;
  productTitle: string;
  variantTitle: string;
  image: ProductImage | null;
  unitPrice: Money;
  quantity: number;
  lineTotal: Money;
};

export type Cart = { id: string; checkoutUrl: string; items: CartItem[]; itemCount: number; subtotal: Money; total: Money };

export type COAData = {
  productHandle: string;
  productName: string;
  lotNumber?: string;
  testedDate?: string;
  laboratory?: string;
  identity?: string;
  purity?: string;
  netContent?: string;
  endotoxin?: string;
  heavyMetals?: string;
  pdfUrl?: string;
};

export type ProductDocumentation = { storageInstructions?: string; intendedUse?: string; coa?: COAData };

export type ProductPage = { products: Product[]; nextCursor: string | null; hasNextPage: boolean };

export type CustomerProfile = { id: string; firstName: string | null; lastName: string | null; email: string; phone: string | null };

export type CustomerRegistration = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  state: string;
  intendedUse: string;
  password: string;
  consentAccepted: true;
  consentVersion: string;
};

export type CommerceAdapter = {
  getProducts: (input?: { first?: number; collectionHandle?: string }) => Promise<Product[]>;
  getProductPage: (input?: { first?: number; after?: string | null; collectionHandle?: string }) => Promise<ProductPage>;
  getProduct: (handle: string) => Promise<Product | null>;
  getCollections: (first?: number) => Promise<Collection[]>;
  getCollection: (handle: string) => Promise<Collection | null>;
  createCart: (lines: { variantId: string; quantity: number }[]) => Promise<Cart>;
  getCart: (cartId: string) => Promise<Cart | null>;
  addToCart: (cartId: string, lines: { variantId: string; quantity: number }[]) => Promise<Cart>;
  updateCart: (cartId: string, lines: { lineId: string; quantity: number }[]) => Promise<Cart>;
  removeFromCart: (cartId: string, lineIds: string[]) => Promise<Cart>;
  getProductDocumentation: (handle: string) => Promise<ProductDocumentation | null>;
  getCOAs: () => Promise<COAData[]>;
};

export class CommerceError extends Error {
  constructor(message: string, public readonly kind: "unavailable" | "not_found" | "invalid" | "configuration" = "unavailable") { super(message); }
}
