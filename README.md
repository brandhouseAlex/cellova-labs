# Cellova Labs — Headless Commerce Storefront

A production-ready, **provider-independent** ecommerce storefront for Cellova Labs, built with **Next.js (App Router), TypeScript, React Server Components, and Tailwind CSS v4**.

The storefront runs out of the box against a built-in **mock commerce provider** (no external services required) and is architected so you can later connect **Medusa v2** *or* **headless Shopify (Storefront API)** — and the **Tagada Pay** payment processor — without rebuilding any UI.

---

## Quick Start

```bash
npm install
cp .env.example .env.local   # optional for the mock build
npm run dev                  # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

Quality checks:

```bash
npm run lint                 # ESLint (zero errors)
npx tsc --noEmit             # TypeScript (zero errors)
```

---

## Architecture at a Glance

```
app/                         # Routes (App Router, RSC by default)
  page.tsx                   # Homepage
  about/  contact/           # Company pages
  products/                  # Catalog + [handle] product detail
  collections/               # Collections index + [handle] detail
  cart/  checkout/           # Commerce flow (noindex)
  account/                   # Login/register, orders, order detail (noindex)
  policies/                  # research-use, privacy, terms, shipping, returns
  sitemap.ts  robots.ts      # Dynamic SEO infrastructure
components/
  layout/  ui/               # Header, footer, providers, primitives
  product/ collection/       # Cards, catalog toolbar, purchase panel
  cart/  checkout/           # Drawer, cart view, checkout, payment/
  account/ gate/ seo/        # Auth forms, dashboard, research gate, breadcrumbs
  research/                  # ResearchUseNotice
lib/
  commerce/                  # THE COMMERCE ABSTRACTION (see below)
    index.ts  types.ts  config.ts
    providers/  mock/  medusa/  shopify/
  payments/                  # Payment abstraction (Tagada Pay goes here)
    providers/  mock/  tagada/
  mock-data/                 # ALL temporary demo data (delete when live)
  auth/                      # Client auth + cart stores (provider-backed)
  seo/  utils/               # Metadata/JSON-LD builders, helpers
public/
  brand/                     # Logo (swap with official file), hero art
  products/  collections/    # Demo imagery (replace with real photography)
```

### The Commerce Abstraction (most important file)

UI components **never** import `@medusajs/js-sdk` or call the Shopify Storefront API. They import only:

```ts
import { commerce } from "@/lib/commerce";
```

`commerce` is a `CommerceProvider` (see `lib/commerce/types.ts`) exposing normalized methods: `getProducts`, `getProductByHandle`, `getCollections`, `getCollectionByHandle`, `createCart`, `getCart`, `addCartItem`, `updateCartItem`, `removeCartItem`, `login`, `register`, `logout`, `getCustomer`, `getOrders`, `getOrderById`.

The active adapter is chosen by one environment variable:

```bash
COMMERCE_PROVIDER=mock      # default — demo catalog, zero dependencies
COMMERCE_PROVIDER=medusa    # Medusa v2 (implement the adapter first)
COMMERCE_PROVIDER=shopify   # Shopify Storefront API (implement first)
```

Every adapter transforms provider-native responses into the shared `CommerceProduct`, `CommerceVariant`, `CommerceCollection`, `CommerceCart`, `CommerceCustomer`, and `CommerceOrder` types before data reaches the UI.

---

## Connecting Medusa v2

1. `npm install @medusajs/js-sdk`
2. Set env vars:
   ```bash
   COMMERCE_PROVIDER=medusa
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-medusa-backend.com
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
   ```
3. Implement the methods in **`lib/commerce/providers/medusa/index.ts`** — the file contains a complete mapping guide (SDK call → interface method) and a bootstrap snippet.
4. Allow-list your Medusa file-service host in `next.config.ts` → `images.remotePatterns`.

## Connecting Shopify (Storefront API)

1. Set env vars:
   ```bash
   COMMERCE_PROVIDER=shopify
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=<public storefront token>
   NEXT_PUBLIC_SHOPIFY_API_VERSION=2025-01
   ```
2. Implement the methods in **`lib/commerce/providers/shopify/index.ts`** — the file contains a GraphQL request helper and query-mapping guide.
3. Allow-list `cdn.shopify.com` in `next.config.ts` → `images.remotePatterns`.

> Never put Admin API tokens or other private credentials in `NEXT_PUBLIC_*` variables.

## Connecting Tagada Pay (later)

The checkout renders a provider-independent payment section (`components/checkout/payment/`) with `PaymentProvider`, `PaymentElement`, `PaymentStatusMessage`, and `PaymentErrorMessage`. To integrate Tagada Pay:

1. Implement **`lib/payments/providers/tagada/index.ts`** against the `PaymentProviderAdapter` contract (`initialize`, `getStatus`, `confirm`) — the file contains a full checklist covering 3DS/`requires_action`, idempotency, and webhook-driven status changes.
2. Add **server-only** env vars `TAGADA_API_KEY` and `TAGADA_WEBHOOK_SECRET` (no `NEXT_PUBLIC_` prefix).
3. Add a webhook route (e.g. `app/api/webhooks/tagada/route.ts`) that verifies the webhook secret and drives order status updates.
4. Set `PAYMENT_PROVIDER=tagada` and register the adapter in `lib/payments/index.ts`.

Raw card data must never touch this codebase — render Tagada's secure fields inside `<PaymentElement />`.

---

## Deploying to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Vercel: **Add New → Project → Import** the repo. Framework is auto-detected (Next.js).
3. Add environment variables from `.env.example` (at minimum `NEXT_PUBLIC_SITE_URL=https://your-domain.com`).
4. Deploy. No custom build settings are required.

The project is a standard Next.js app — it also deploys to any Node.js host (`npm run build && npm run start`) or container platform.

---

## The Research Network Gate & SEO

Unauthenticated visitors see a premium **Research Network gate** overlay (login / create account / age + research-use acknowledgement, with a guest-browsing option). The gate is a **client-side overlay only**:

- All page content — homepage copy, product names/descriptions, collection copy, metadata, canonical URLs, JSON-LD, internal links, and the sitemap — is **server-rendered identically for every visitor**, including search engines.
- There is **no user-agent detection and no cloaking** anywhere in the codebase.
- The gate restricts **commerce actions** (ordering, account data), not indexable content.
- Private routes (`/cart`, `/checkout`, `/account*`) are `noindex` and disallowed in `robots.ts`, and are excluded from `sitemap.ts`.

## Mock Data to Replace Before Production

Everything below is demo-only and lives in `lib/mock-data/` + `public/`:

| Asset | Location | Replace with |
|---|---|---|
| Product catalog (14 SKUs) | `lib/mock-data/products.ts` | Medusa/Shopify catalog |
| Collections (7) | `lib/mock-data/collections.ts` | Provider collections |
| Demo orders | `lib/mock-data/orders.ts` | Provider order history |
| Product illustrations | `public/products/*.svg` | Real product photography |
| Collection artwork | `public/collections/*.svg` | Real editorial imagery |
|  Official logo | `public/brand/logo-official.png`, `logo-transparent.png`, `logo-light.png`, `favicon.png` | Higher-resolution or vector masters, if available |
| Contact emails | `app/contact/page.tsx` (`*.example`) | Verified addresses |
| Policy copy | `app/policies/*` | Counsel-reviewed final text |

## Remaining Production Integrations

1. **Commerce backend** — implement the Medusa or Shopify adapter (files above).
2. **Payments** — implement the Tagada Pay adapter + webhook route.
3. **Contact form delivery** — point `components/contact/contact-form.tsx` at a Route Handler backed by your email provider.
4. **Real authentication** — the mock auth adapter (`lib/auth/`) is demo-grade; real customer auth comes from the connected commerce provider.
5. **Official logo & imagery** — swap the placeholder assets in `public/brand/`.
6. **Legal review** — finalize policy pages with counsel.

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Compliance Notes

All product copy is neutral and research-oriented. The site displays **Research Use Only** notices on the homepage, product pages, cart, checkout, footer, and registration gate, and never claims to diagnose, treat, cure, or prevent disease. Product structured data is generated only from real, available product fields.
