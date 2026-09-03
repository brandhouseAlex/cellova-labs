# Commerce and Deployment Setup

## Deployment model

This source repository is a headless Next.js storefront intended for a distinct Vercel project. The commerce platform provides products, collections, product images, variants, carts, checkout, customer records, and product documentation. Public URLs remain Cellova URLs regardless of the selected provider.

> **Provider ownership:** This source does not contain, provision, or fall back to any project-provisioned Shopify store. It connects only when the Cellova team supplies the explicit `CELLOVA_*` provider variables in its own Vercel project.

The provider is chosen by a single server environment value:

```text
CELLOVA_COMMERCE_PROVIDER=shopify
```

Changing it to `medusa` switches the selection seam; the public routes and UI types remain unchanged. A complete Medusa integration still needs the endpoint, authentication scheme, and normalized mapping described below.

## Environment variables

Configure the following values in the Cellova-managed Vercel project rather than committing credentials. The storefront does not provision, select, or contain a Shopify store, and it has no public provider aliases. Never expose an Admin token in a browser bundle.

| Variable | Scope | Provider | Required when | Purpose |
| --- | --- | --- | --- | --- |
| `CELLOVA_COMMERCE_PROVIDER` | Server | All | Always | Selects `shopify` or `medusa`; the Cellova team owns this choice in Vercel. |
| `NEXT_PUBLIC_SITE_URL` | Public | All | Production | Canonical base URL for metadata, sitemap, and structured data. |
| `CELLOVA_SHOPIFY_STORE_DOMAIN` | Server | Shopify | Shopify active | Cellova-managed Shopify store domain for server Storefront and Admin calls. |
| `CELLOVA_SHOPIFY_STOREFRONT_TOKEN` | Server | Shopify | Shopify active | Cellova-managed Storefront token for catalog, cart, and customer requests. |
| `CELLOVA_SHOPIFY_API_VERSION` | Server | Shopify | Shopify active | Pinned Storefront and Admin API version. |
| `CELLOVA_SHOPIFY_ADMIN_TOKEN` | Server-only | Shopify | Customer registration metadata active | Cellova-managed least-privilege Admin token for durable customer metafield writes. |
| `CATALOG_GATE_ENABLED` | Server | All | Optional | Set `true` to require a signed commerce customer session for catalog pages. |
| `CELLOVA_CUSTOMER_SESSION_TTL_SECONDS` | Server | All | Optional | Signed customer-session cookie lifetime; defaults to 14 days. |
| `CELLOVA_SHOPIFY_METAFIELD_NAMESPACE` | Server | Shopify | Documentation or registration metadata active | Central namespace used by all mapped product and customer fields. |
| `CELLOVA_CUSTOMER_*_KEY` | Server | Shopify | Registration active | Six customer custom-field/consent keys described below. |
| `CELLOVA_COA_*_KEY` | Server | Shopify | COA display active | Product documentation and COA keys described below. |
| `CELLOVA_COA_METAOBJECT_REFERENCE_KEY` | Server | Shopify | Metaobject COA fallback active | Product metafield key holding the COA metaobject reference. |
| `CELLOVA_COA_METAOBJECT_TYPE` | Server | Shopify | Optional metaobject type guard | Expected Shopify metaobject type for the referenced COA record. |
| `CELLOVA_STORAGE_INSTRUCTIONS_KEY` | Server | Shopify | Product storage display active | Product metafield key for storage instructions. |
| `CELLOVA_INTENDED_USE_KEY` | Server | Shopify | Product intended-use display active | Product metafield key for intended use. |
| `MEDUSA_BACKEND_URL` | Server | Medusa | Medusa active | Medusa backend base URL. |
| `MEDUSA_PUBLISHABLE_API_KEY` | Server | Medusa | Medusa active | Medusa public storefront key, if required by the deployment. |
| `MEDUSA_API_KEY` | Server-only | Medusa | Privileged Medusa work | Private Medusa server credential. |
| `JWT_SECRET` | Server-only | All | Always | Signs the Cellova customer-session cookie. |

## Shopify metadata contract

The implementation deliberately has **no invented production namespace or metafield keys**. Configure a real namespace in `CELLOVA_SHOPIFY_METAFIELD_NAMESPACE` and assign the matching key values below. `lib/commerce/shopify/metafields.ts` is the only central mapping location; raw namespace/key pairs do not appear in presentation components.

| Central environment key | Owner | Normalized field | Expected content |
| --- | --- | --- | --- |
| `CELLOVA_COA_PRODUCT_NAME_KEY` | Product | `coa.productName` | Product name for the certificate record. |
| `CELLOVA_COA_LOT_NUMBER_KEY` | Product | `coa.lotNumber` | Lot or batch identifier. |
| `CELLOVA_COA_TESTED_DATE_KEY` | Product | `coa.testedDate` | Tested date. |
| `CELLOVA_COA_LABORATORY_KEY` | Product | `coa.laboratory` | Testing laboratory. |
| `CELLOVA_COA_IDENTITY_KEY` | Product | `coa.identity` | Identity result, such as LC-MS/MS information. |
| `CELLOVA_COA_PURITY_KEY` | Product | `coa.purity` | Purity result, such as RP-HPLC information. |
| `CELLOVA_COA_NET_CONTENT_KEY` | Product | `coa.netContent` | Net-content result. |
| `CELLOVA_COA_ENDOTOXIN_KEY` | Product | `coa.endotoxin` | Endotoxin result. |
| `CELLOVA_COA_HEAVY_METALS_KEY` | Product | `coa.heavyMetals` | Heavy-metals result. |
| `CELLOVA_COA_PDF_KEY` | Product | `coa.pdfUrl` | Full HTTPS URL for the approved certificate document. |
| `CELLOVA_COA_METAOBJECT_REFERENCE_KEY` | Product | COA source | Product metafield key containing the configured COA metaobject reference. |
| `CELLOVA_STORAGE_INSTRUCTIONS_KEY` | Product | `storageInstructions` | Product storage copy. |
| `CELLOVA_INTENDED_USE_KEY` | Product | `intendedUse` | Product-specific intended-use copy. |
| `CELLOVA_CUSTOMER_COMPANY_KEY` | Customer | `company` | Company or affiliation. |
| `CELLOVA_CUSTOMER_STATE_KEY` | Customer | `state` | Customer state. |
| `CELLOVA_CUSTOMER_INTENDED_USE_KEY` | Customer | `intendedUse` | Customer selected intended use. |
| `CELLOVA_CUSTOMER_CONSENT_ACCEPTED_KEY` | Customer | `consentAccepted` | Boolean consent evidence. |
| `CELLOVA_CUSTOMER_CONSENT_VERSION_KEY` | Customer | `consentVersion` | Consent policy version. |
| `CELLOVA_CUSTOMER_CONSENT_TIMESTAMP_KEY` | Customer | `consentTimestamp` | ISO timestamp stored as a date-time field. |

Product COA UI is hidden when the normalized record contains no actual COA result. Product-field values are read first; when the configured reference field resolves to a matching Shopify COA metaobject, its centrally configured field keys are used as a fallback. The COA Library additionally requires a validated HTTPS document URL, so it does not list incomplete or broken certificate records.

## Required Shopify setup

The following setup remains outside the website source:

1. In the Cellova-owned Shopify account connected to Vercel, configure payment and checkout behavior, then publish approved products to the chosen sales channel.
2. Create the `Vials`, `Capsules`, `Serums`, and `Nasal Sprays` collections with the chosen provider-managed handles. Add products, variants, real images, inventory availability, and prices in the Cellova-owned Shopify account.
3. Create and populate the product and customer metafields in the preceding table. Configure the related environment keys with the actual namespace and keys before enabling documentation or registration metadata writes.
4. Ensure the Storefront token has the scopes needed for catalog, cart, and customer access. Enable the Shopify customer-account flow compatible with Storefront customer access-token operations.
5. Create a least-privilege Admin API token for customer metafield writes, store it only in `CELLOVA_SHOPIFY_ADMIN_TOKEN`, and set `CATALOG_GATE_ENABLED=true` only after the sign-in flow has been tested in production.

## Medusa provider switch

To activate Medusa, implement the guarded methods in `lib/commerce/medusa/adapter.ts` and `lib/commerce/customer-provider.ts` with server-only Medusa API calls. Map Medusa responses into `lib/commerce/types.ts`, including carts, checkout URL, product documentation, COA data, customer registration, consent evidence, and authenticated customer lookup. Set `CELLOVA_COMMERCE_PROVIDER=medusa` only after those functions, error handling, and production tests are complete. No page, component, or public route should need a rewrite.

## Safety and deployment checks

The project has no custom Vercel runtime declaration and no theme template files. Production deployment uses the native Next.js build command. Catalog and account errors are handled with customer-safe messages; provider details, Admin credentials, private keys, and raw upstream failures are never rendered to customers.
