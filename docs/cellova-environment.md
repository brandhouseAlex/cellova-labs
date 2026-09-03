# Cellova Labs Environment Configuration

Set these values through the deployment environment only. Do not commit `.env` files or reuse identifiers from another storefront.

| Variable | Visibility | Required for | Value to supply |
| --- | --- | --- | --- |
| `VITE_SITE_URL` | Public | Canonical URLs and structured data | Final Cellova domain; use a safe preview fallback before launch. |
| `VITE_CONTACT_EMAIL` | Public | Footer contact link | Published Cellova support address. |
| `COMMERCE_PROVIDER` | Server only | Commerce adapter selection | Set to `shopify` (default) or `medusa`. |
| `SHOPIFY_STORE_DOMAIN` | Server only | Shopify Storefront API | New Cellova Shopify domain. |
| `SHOPIFY_STOREFRONT_API_ACCESS_TOKEN` | Server only | Shopify Storefront API | New Cellova public Storefront API token. |
| `MEDUSA_BACKEND_URL` | Server only | Medusa Store API | Base URL for the independent Medusa backend, without a trailing slash. |
| `MEDUSA_PUBLISHABLE_KEY` | Server only | Medusa Store API | Independent Medusa publishable API key. |
| `MEDUSA_REGION_ID` | Server only | Medusa pricing and carts | Optional Medusa region ID for catalog prices and new carts. |
| `MEDUSA_CURRENCY_CODE` | Server only | Medusa price normalization | Optional ISO 4217 default; defaults to `USD`. |
| `MEDUSA_CHECKOUT_URL` | Server only | Medusa checkout handoff | Optional checkout URL template; use `{cart_id}` where the Medusa cart ID belongs. |
| `VITE_ANALYTICS_ENDPOINT` | Public | Optional analytics loader | New Cellova analytics endpoint only. |
| `VITE_ANALYTICS_WEBSITE_ID` | Public | Optional analytics loader | New Cellova analytics property identifier only. |
| `CELLOVA_EMAIL_PROVIDER_API_KEY` | Server only | Future notification/email integration | New Cellova provider key, if this feature is enabled. |
| `CELLOVA_CAPTCHA_SITE_KEY` | Public | Future form protection | New Cellova CAPTCHA site key, if enabled. |
| `CELLOVA_CAPTCHA_SECRET_KEY` | Server only | Future form protection | New Cellova CAPTCHA secret, if enabled. |
| `CELLOVA_WEBHOOK_SECRET` | Server only | Future Shopify/webhook verification | New Cellova webhook signing secret, if enabled. |

The platform supplies authentication, database, and internal service variables separately. Those values do not belong in documentation, source control, customer-facing code, or a copied configuration file.

## Provider selection

The storefront UI always calls the same `commerce.*` procedures. Set `COMMERCE_PROVIDER=shopify` to use the configured Shopify Storefront API or `COMMERCE_PROVIDER=medusa` to use the Medusa Store API. Set credentials for **only the selected provider**; do not use production tokens from one platform in the other provider’s configuration.

> Shopify remains the default so existing Cellova previews continue to work. A Medusa switch requires `MEDUSA_BACKEND_URL` and `MEDUSA_PUBLISHABLE_KEY`; add a region, currency, and checkout URL template when those are applicable to the Medusa installation.
