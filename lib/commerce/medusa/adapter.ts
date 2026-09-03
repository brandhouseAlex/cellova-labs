import "server-only";
import type { CommerceAdapter } from "../types";
import { CommerceError } from "../types";

function unavailable(): never { throw new CommerceError("The selected commerce service is not configured. Please contact Cellova Labs support.", "configuration"); }

/**
 * Medusa stays behind the same interface as Shopify. Configure the documented
 * MEDUSA_* variables and replace these guarded methods with normalized API calls
 * when the provider is activated; storefront routes do not change.
 */
export const medusaAdapter: CommerceAdapter = {
  getProducts: unavailable, getProductPage: unavailable, getProduct: unavailable, getCollections: unavailable, getCollection: unavailable,
  createCart: unavailable, getCart: unavailable, addToCart: unavailable, updateCart: unavailable, removeFromCart: unavailable,
  getProductDocumentation: unavailable, getCOAs: unavailable,
};
