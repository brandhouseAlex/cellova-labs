# Commerce Provider Switching

The Cellova storefront is provider-neutral at the UI and tRPC layers. Product grids, product pages, cart state, checkout handoff, and COA presentation continue to call the same `commerce.*` procedures regardless of the selected provider. Only the server-side adapter changes.

| Setting | Shopify | Medusa |
| --- | --- | --- |
| `COMMERCE_PROVIDER` | `shopify` or unset | `medusa` |
| Required credentials | `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_API_ACCESS_TOKEN` | `MEDUSA_BACKEND_URL`, `MEDUSA_PUBLISHABLE_KEY` |
| Pricing/carts | Managed by Shopify Storefront API | Managed by Medusa Store API; set `MEDUSA_REGION_ID` when required |
| Checkout handoff | Returned by Shopify cart API | Returned by Medusa cart API or built from `MEDUSA_CHECKOUT_URL` |
| COA lot record | `cellova_coa` product metafields | Product `metadata.cellova_coa` object or `cellova_coa_*` metadata keys |

## Switching procedure

First, configure the selected provider’s new Cellova credentials through the deployment environment. Next, set `COMMERCE_PROVIDER` to `shopify` or `medusa`, redeploy, and test the catalog, product detail, cart create/add/update/remove flow, checkout handoff, and COA record visibility. The React storefront does not need code changes for a provider switch.

For Medusa, expose standard Store API endpoints for products, collections, carts, and line items. Prices are normalized from Medusa minor units into the shared decimal-string storefront contract. If the Medusa cart response does not include `checkout_url`, set `MEDUSA_CHECKOUT_URL` to a Cellova checkout template such as `https://checkout.example/cart/{cart_id}`.

> Do not run both providers against the same live customer flow. Select one active provider, use separate credentials, and migrate catalog/customer data deliberately before changing production traffic.
