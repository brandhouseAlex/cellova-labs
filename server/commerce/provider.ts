import { TRPCError } from "@trpc/server";
import type { CommerceProvider, CommerceProviderName } from "./types";
import * as medusa from "../_core/medusa";
import * as shopify from "../_core/shopify";

function configuredProviderName(): CommerceProviderName {
  const requested = (process.env.COMMERCE_PROVIDER ?? "shopify").trim().toLowerCase();
  if (requested === "shopify" || requested === "medusa") return requested;
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "COMMERCE_PROVIDER must be either 'shopify' or 'medusa'",
  });
}

const shopifyProvider: CommerceProvider = {
  name: "shopify",
  isConfigured: shopify.isShopifyConfigured,
  listProducts: shopify.listProducts,
  getProductByHandle: shopify.getProductByHandle,
  listCollections: shopify.listCollections,
  getCollectionByHandle: shopify.getCollectionByHandle,
  createCart: shopify.createCart,
  getCart: shopify.getCart,
  addCartLines: shopify.addCartLines,
  updateCartLines: shopify.updateCartLines,
  removeCartLines: shopify.removeCartLines,
};

const medusaProvider: CommerceProvider = {
  name: "medusa",
  isConfigured: medusa.isMedusaConfigured,
  listProducts: medusa.listProducts,
  getProductByHandle: medusa.getProductByHandle,
  listCollections: medusa.listCollections,
  getCollectionByHandle: medusa.getCollectionByHandle,
  createCart: medusa.createCart,
  getCart: medusa.getCart,
  addCartLines: medusa.addCartLines,
  updateCartLines: medusa.updateCartLines,
  removeCartLines: medusa.removeCartLines,
};

export function getCommerceProvider(): CommerceProvider {
  return configuredProviderName() === "medusa" ? medusaProvider : shopifyProvider;
}

export function getCommerceProviderName(): CommerceProviderName {
  return configuredProviderName();
}
