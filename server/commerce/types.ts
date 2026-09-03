/**
 * Server-side commerce provider contract.
 *
 * Storefront components only use the normalized shared commerce types and the
 * stable tRPC procedures. Shopify and Medusa implementations live behind this
 * contract so a provider switch does not require UI changes.
 */
import type { Cart, Collection, Product } from "@shared/commerce/types";

export type CommerceProviderName = "shopify" | "medusa";

export type ListProductsOptions = {
  first?: number;
  collectionHandle?: string;
};

export type CartLineInput = { variantId: string; quantity: number };
export type CartLineUpdate = { lineId: string; quantity: number };

export interface CommerceProvider {
  readonly name: CommerceProviderName;
  isConfigured(): boolean;
  listProducts(options?: ListProductsOptions): Promise<Product[]>;
  getProductByHandle(handle: string): Promise<Product>;
  listCollections(first?: number): Promise<Collection[]>;
  getCollectionByHandle(handle: string): Promise<Collection>;
  createCart(lines: CartLineInput[]): Promise<Cart>;
  getCart(cartId: string): Promise<Cart | null>;
  addCartLines(cartId: string, lines: CartLineInput[]): Promise<Cart>;
  updateCartLines(cartId: string, updates: CartLineUpdate[]): Promise<Cart>;
  removeCartLines(cartId: string, lineIds: string[]): Promise<Cart>;
}
