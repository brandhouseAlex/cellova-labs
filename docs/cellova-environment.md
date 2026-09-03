# Cellova Labs Environment Configuration

Set these values through the deployment environment only. Do not commit `.env` files or reuse identifiers from another storefront.

| Variable | Visibility | Required for | Value to supply |
| --- | --- | --- | --- |
| `VITE_SITE_URL` | Public | Canonical URLs and structured data | Final Cellova domain; use a safe preview fallback before launch. |
| `VITE_CONTACT_EMAIL` | Public | Footer contact link | Published Cellova support address. |
| `SHOPIFY_STORE_DOMAIN` | Server only | Shopify Storefront API | New Cellova Shopify domain. |
| `SHOPIFY_STOREFRONT_API_ACCESS_TOKEN` | Server only | Shopify Storefront API | New Cellova public Storefront API token. |
| `VITE_ANALYTICS_ENDPOINT` | Public | Optional analytics loader | New Cellova analytics endpoint only. |
| `VITE_ANALYTICS_WEBSITE_ID` | Public | Optional analytics loader | New Cellova analytics property identifier only. |
| `CELLOVA_EMAIL_PROVIDER_API_KEY` | Server only | Future notification/email integration | New Cellova provider key, if this feature is enabled. |
| `CELLOVA_CAPTCHA_SITE_KEY` | Public | Future form protection | New Cellova CAPTCHA site key, if enabled. |
| `CELLOVA_CAPTCHA_SECRET_KEY` | Server only | Future form protection | New Cellova CAPTCHA secret, if enabled. |
| `CELLOVA_WEBHOOK_SECRET` | Server only | Future Shopify/webhook verification | New Cellova webhook signing secret, if enabled. |

The platform supplies authentication, database, and internal service variables separately. Those values do not belong in documentation, source control, customer-facing code, or a copied configuration file.
