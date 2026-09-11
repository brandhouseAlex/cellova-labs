# Shopify Cart Integration Research

## Verified Cellova Configuration

The existing Cellova Vercel project uses `COMMERCE_PROVIDER=shopify` and the public Storefront domain `cellova-labs-w5v5hxfa.myshopify.com`. The project has a configured public Storefront token. No Biotiva store domain or credential is used by the cart implementation.

## Storefront Cart API Requirements

Shopify’s Storefront API documents that `cartCreate` creates a buyer-session cart and returns `checkoutUrl`, which directs the buyer to Shopify web checkout. It permits buyer identity and initial lines in the cart input. The implementation persists only the Shopify cart ID in browser storage and treats Shopify cart responses as the authoritative source for lines, pricing, quantity, and checkout URL.

`cartLinesAdd` accepts product-variant merchandise IDs and quantities. `cartLinesUpdate` changes existing cart-line quantities, and `cartLinesRemove` removes existing cart-line IDs. Each mutation returns the updated cart alongside user errors and warnings; the adapter fails closed on GraphQL, HTTP, and mutation user errors.

For an authenticated Cellova customer, cart creation includes the verified session customer email in Shopify cart buyer identity, which allows supported checkout prefill without placing Customer Account access tokens into browser storage.

## Sources

1. [Shopify Storefront API: cartCreate](https://shopify.dev/docs/api/storefront/latest/mutations/cartCreate)
2. [Shopify Storefront API: cartLinesAdd](https://shopify.dev/docs/api/storefront/latest/mutations/cartLinesAdd)
3. [Shopify Storefront API: cartLinesUpdate](https://shopify.dev/docs/api/storefront/latest/mutations/cartLinesUpdate)
4. [Shopify Storefront API: cartLinesRemove](https://shopify.dev/docs/api/storefront/latest/mutations/cartLinesRemove)

## Deployment Observation

The GitHub `main` commit `7614bd9` was pushed for Vercel production validation. The deployment reached **Ready** and the live Cart API and hosted-checkout validation is recorded in [Shopify Cart & Hosted Checkout Production Validation](./shopify-cart-production-validation.md).
