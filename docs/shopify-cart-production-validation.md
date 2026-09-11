# Shopify Cart & Hosted Checkout Production Validation

## Scope and Environment

Production validation was performed on the canonical Cellova storefront after deployment of Git commit `7614bd9`. The configured Storefront domain is `cellova-labs-w5v5hxfa.myshopify.com` and hosted checkout opened on that same Shopify domain. No order was submitted.

| Validation | Result | Evidence |
| --- | --- | --- |
| Create cart and add a multi-variant product | PASS | AOD-9604 (10mg) entered the Shopify cart at quantity 1. |
| Update a cart-line quantity | PASS | The AOD-9604 line moved from quantity 1 to 2, with its line total and subtotal updating from $65.00 to $130.00. |
| Add a distinct single-variant product | PASS | B12 - 10ml entered as a second cart line at quantity 1. |
| Header quantity and drawer state | PASS | The live header/drawer reflected 1, 2, and then 3 total items as line operations completed. |
| Cart-page rendering | PASS | The cart page displayed both Shopify-backed line names, variants, images, quantities, unit prices, line totals, subtotal, and calculated-at-checkout shipping/tax text. |
| Refresh persistence | PASS | Reloading `/cart` retained the AOD-9604 line at quantity 2 and the header quantity of 2. |
| Hosted checkout handoff | PASS | The checkout action opened Shopify-hosted checkout on the configured Cellova `.myshopify.com` domain. |
| Checkout contents | PASS | Shopify checkout displayed B12 - 10ml at quantity 1 and AOD-9604 10mg at quantity 2, totaling three items and $174.00. |
| Payment surface | PASS with platform limitation | Shopify checkout displayed its secure payment surface but stated that the store cannot currently accept payments. |
| Order submission | NOT RUN | No order was submitted because the hosted checkout reported that payments are unavailable; this avoided creating a duplicate or incomplete test order. |
| Remove individual lines | PASS | B12 and AOD-9604 each removed successfully through the Shopify Cart API. |
| Empty-cart state | PASS | The final cart showed zero items and the existing empty-cart presentation. |

## Result

The Cellova cart uses Shopify as the live cart and checkout authority. Cart line creation, update, removal, refresh restoration, header quantity, drawer/cart presentation, and hosted-checkout handoff were verified in production. The only external limitation is Shopify’s current payment availability, which prevents an order-submission test until payment acceptance is enabled in the store.
