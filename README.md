# Cellova Labs Storefront

Cellova Labs is a standalone **Next.js App Router** ecommerce storefront. It is designed to deploy as a separate Vercel project and communicates with the selected commerce engine only through a provider-neutral application boundary. It is not a theme project, does not include Liquid files, and does not put the storefront inside the commerce platform.

The visual system follows the supplied Cellova Labs visual guide. It uses Paper (`#F3F4F1`), Ink (`#12141C`), Indigo (`#2D3452`), Slate (`#8B93A7`), and Spark (`#F2A63C`), with Sora for display work, Inter for interface copy, and IBM Plex Mono for technical metadata.

## Run locally

Install dependencies with `pnpm install`, then configure the required deployment settings in your local environment. Start the storefront with `pnpm dev`. Use `pnpm check`, `pnpm lint`, `pnpm test`, and `pnpm build` before releasing changes.

## Architecture

The storefront keeps stable customer-facing routes such as `/shop`, `/collections/[handle]`, `/products/[handle]`, `/coa-library`, and `/account`. UI components consume normalized types from `lib/commerce/types.ts`; product, collection, cart, documentation, and customer operations are dispatched through `lib/commerce/provider.ts` and `lib/commerce/customer-provider.ts`.

| Layer | Responsibility |
| --- | --- |
| Next.js App Router | Responsive storefront UI, SEO, route handling, and server-rendered catalog pages. |
| Commerce boundary | Normalized models and an environment-selected provider adapter. |
| Shopify adapter | Server-only Storefront catalog/cart/customer access plus privileged server-only customer metadata writes. |
| Medusa adapter | A guarded implementation seam for normalized future Medusa API work. |
| Customer session | Signed, `HttpOnly`, secure server cookie; no browser-only sign-in or catalog authorization flag is used. |

> **Operational note:** The current connected Shopify store does not have product records. The UI intentionally renders a controlled-release state rather than fabricated merchandise, prices, or certificates.

Refer to [Commerce and deployment setup](docs/commerce-setup.md) for the precise environment and metadata contract.
