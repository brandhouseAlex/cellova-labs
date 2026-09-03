import type {
  CommerceAuthInput,
  CommerceAuthResult,
  CommerceCart,
  CommerceCollection,
  CommerceCustomer,
  CommerceOrder,
  CommercePaginatedResult,
  CommerceProduct,
  CommerceProductQuery,
  CommerceProvider,
  CommerceRegisterInput,
} from "@/lib/commerce/types";
import { commerceConfig } from "@/lib/commerce/config";

/**
 * MEDUSA v2 ADAPTER — INTEGRATION POINT
 * =====================================
 *
 * This is where the Medusa backend is connected. To activate:
 *
 *   1. Install the SDK:        npm install @medusajs/js-sdk
 *   2. Set environment variables:
 *        COMMERCE_PROVIDER=medusa
 *        NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-medusa-backend.com
 *        NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
 *   3. Implement each method below using the SDK, then transform every
 *      Medusa response into the normalized Commerce* types from
 *      lib/commerce/types.ts before returning.
 *
 * Suggested SDK bootstrap:
 *
 *   import Medusa from "@medusajs/js-sdk";
 *   const sdk = new Medusa({
 *     baseUrl: commerceConfig.medusa.backendUrl!,
 *     publishableKey: commerceConfig.medusa.publishableKey,
 *   });
 *
 * Mapping guidance:
 *   - sdk.store.product.list()      -> getProducts()
 *   - sdk.store.product.list({ handle }) -> getProductByHandle()
 *   - sdk.store.collection.list()   -> getCollections()
 *   - sdk.store.cart.create()       -> createCart()
 *   - sdk.store.cart.createLineItem()    -> addCartItem()
 *   - sdk.store.cart.updateLineItem()    -> updateCartItem()
 *   - sdk.store.cart.deleteLineItem()    -> removeCartItem()
 *   - sdk.store.customer.*          -> login/register/getCustomer
 *   - sdk.store.order.list()        -> getOrders()
 *
 * UI components must NEVER import @medusajs/js-sdk directly — all
 * Medusa-specific code stays inside this directory.
 */

function notConfigured(): never {
  throw new Error(
    "[commerce] The Medusa provider is selected but not yet implemented. " +
      "See lib/commerce/providers/medusa/index.ts for integration steps, " +
      "or set COMMERCE_PROVIDER=mock to use the demo catalog."
  );
}

export const medusaProvider: CommerceProvider = {
  name: "medusa",

  async getProducts(
    _query?: CommerceProductQuery
  ): Promise<CommercePaginatedResult<CommerceProduct>> {
    void commerceConfig.medusa;
    return notConfigured();
  },
  async getProductByHandle(_handle: string): Promise<CommerceProduct | null> {
    return notConfigured();
  },
  async getCollections(): Promise<CommerceCollection[]> {
    return notConfigured();
  },
  async getCollectionByHandle(
    _handle: string
  ): Promise<CommerceCollection | null> {
    return notConfigured();
  },
  async getProductTypes(): Promise<string[]> {
    return notConfigured();
  },

  async createCart(): Promise<CommerceCart> {
    return notConfigured();
  },
  async getCart(_cartId: string): Promise<CommerceCart | null> {
    return notConfigured();
  },
  async addCartItem(
    _cartId: string,
    _input: { variantId: string; quantity: number }
  ): Promise<CommerceCart> {
    return notConfigured();
  },
  async updateCartItem(
    _cartId: string,
    _lineId: string,
    _quantity: number
  ): Promise<CommerceCart> {
    return notConfigured();
  },
  async removeCartItem(
    _cartId: string,
    _lineId: string
  ): Promise<CommerceCart> {
    return notConfigured();
  },

  async login(_input: CommerceAuthInput): Promise<CommerceAuthResult> {
    return notConfigured();
  },
  async register(
    _input: CommerceRegisterInput
  ): Promise<CommerceAuthResult> {
    return notConfigured();
  },
  async logout(): Promise<void> {
    return notConfigured();
  },
  async getCustomer(_token: string): Promise<CommerceCustomer | null> {
    return notConfigured();
  },

  async getOrders(_token: string): Promise<CommerceOrder[]> {
    return notConfigured();
  },
  async getOrderById(
    _token: string,
    _orderId: string
  ): Promise<CommerceOrder | null> {
    return notConfigured();
  },
};
