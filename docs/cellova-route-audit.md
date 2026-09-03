# Cellova Route-Parity Audit

**Validation date:** September 3, 2026  
**Reference:** Supplied storefront archive route and component inventory

| Route family | Cellova route | Validation result | Access behavior |
| --- | --- | --- | --- |
| Home | `/` | Global gate visible in desktop and mobile viewport checks. | Research account required. |
| Catalog | `/products`, `/catalog` | Search, sort, provider-backed product grid, and product links are implemented. | Research account required. |
| Product detail | `/products/:handle`, `/catalog/:handle` | Product image, specifications, variants, quantity, gated purchase controls, multi-lot COA selector, tabs, service modules, and related products are implemented. | Research account required. |
| Collections | `/collections`, `/collections/:handle` | Provider-backed collection index and product-list route are implemented. | Research account required. |
| Documentation | `/coa-library` | Complete published lot records and source-PDF treatment are implemented. | Research account required. |
| Cart and checkout | `/cart`, `/checkout` | Editable provider-backed cart, research-order preparation, local order record, and provider checkout handoff are implemented. | Research account required. |
| Account and orders | `/account`, `/account/orders`, `/account/orders/:id` | Account profile, pending status, browser-record order list, and order-detail display are implemented. | Research account required. |
| About and contact | `/about`, `/contact` | Public route checks passed; the contact form creates a browser-persisted inquiry reference. | Public. |
| Legal policies | `/policies/terms`, `/policies/privacy`, `/policies/research-use`, `/policies/shipping`, `/policies/returns` | All five public pages rendered in desktop visual checks. | Public. |

## Evidence

The parity build passed TypeScript validation, a production build, and **24 tests**. Public visual checks covered the about, contact, and full policy set. Gated desktop checks confirmed consistent access enforcement for home, catalog, product, collections, COA, cart, checkout, account, collection-detail, order-list, and order-detail route patterns. Mobile checks covered the gate and public information presentation.

The route-decision regression suite explicitly verifies that a `pending` account receives the pending state on protected catalog and order routes, while `/contact` and the other public-information routes remain accessible. An approved account resolves to the approved access state, and an unauthenticated protected route resolves to the registration gate.

An approved-access integration fixture renders the `research-materials` collection detail with its `BPC-157` provider record while the global gate is absent. The live Shopify smoke check independently verifies that the published collection returns the same populated product through the Storefront API.

## Provider behavior

Catalog, product, collection, cart, and checkout use a single server-side commerce contract. `COMMERCE_PROVIDER=shopify` remains the default, while `COMMERCE_PROVIDER=medusa` selects the Medusa adapter without React storefront changes. See [`commerce-provider-switching.md`](./commerce-provider-switching.md).
