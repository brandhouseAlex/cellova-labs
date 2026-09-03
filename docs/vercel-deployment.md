# Separate Cellova Vercel Deployment

Cellova Labs can use the built-in project hosting and custom-domain controls supplied with this project. If an external Vercel deployment is preferred, create an entirely **new Vercel project** from the Cellova Labs repository rather than copying or relinking any pre-existing storefront deployment. External hosting can require additional configuration for the Express server and the platform authentication flow, so validate the preview before routing a production domain.

## Project creation

| Step | Action | Isolation requirement |
| --- | --- | --- |
| 1 | Create a new Vercel project and import only the completed Cellova Labs repository. | Do not import, fork, or relink a pre-existing storefront project. |
| 2 | Select the project root containing `package.json`. | Keep the Cellova codebase as the deployment root. |
| 3 | Use the provided `build` and `start` scripts after confirming Vercel’s server-runtime support. | Do not substitute another storefront’s build settings. |
| 4 | Add fresh environment variables for the Cellova project. | Do not reuse another store’s domains, Shopify tokens, analytics, or webhook secrets. |
| 5 | Deploy to a new preview URL, then test the catalog, cart, checkout handoff, COA library, and responsive navigation. | Do not change an existing live storefront during validation. |
| 6 | Attach a new Cellova domain only after the preview and legal disclosures are approved. | Maintain independent DNS, analytics, and webhook records. |

## Required Cellova environment values

Set the values in the Vercel project’s encrypted environment configuration. The authoritative list and visibility guidance are in [`cellova-environment.md`](./cellova-environment.md). At minimum, configure `VITE_SITE_URL`, `VITE_CONTACT_EMAIL`, `SHOPIFY_STORE_DOMAIN`, and `SHOPIFY_STOREFRONT_API_ACCESS_TOKEN` with fresh Cellova-specific values. Also preserve the platform-provided runtime variables required by the project’s server and authentication layers.

## Pre-production validation

Confirm that the Vercel preview reaches the new Cellova Shopify catalog, that the first catalog product has media, the cart persists under `cellova_cart`, checkout opens only the Cellova store, and no legacy brand text, contacts, IDs, tracking codes, or assets are present. Configure customer accounts, access-form submission, email delivery, CAPTCHA, and webhooks only after their new Cellova credentials are available.

> **Do not publish or redirect customers until the independent Shopify store is claimed, the final legal copy is reviewed, and all customer-facing credentials are Cellova-specific.**
