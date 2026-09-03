# Cellova Functional-Parity Map

This implementation treats the supplied storefront as a **functional reference**, not a source of brand copy, contacts, customer records, or commerce credentials. The Cellova build retains the interaction patterns while using Cellova branding, independent product data, and the selectable Shopify-or-Medusa commerce layer.

| Supplied behavior | Cellova implementation | Route or module |
| --- | --- | --- |
| Global catalog access gate | Two-panel sign-in and account-registration gate, consent acknowledgement, password visibility control, no unauthenticated catalog bypass, and scroll lock. | `ResearchGate` and `ResearchAccessContext` |
| Public information exception | About, contact, and legal-policy pages remain available outside the gate. | `/about`, `/contact`, `/policies/*` |
| Product catalog and filters | Searchable catalog with featured, alphabetical, and price sorting. | `/products` |
| Collection directory and detail | Provider-backed collection grid with collection-specific product listing. | `/collections`, `/collections/:handle` |
| Research product dossier | Image gallery, status badges, gated ordering, variants, quantity controls, documentation tabs, service cards, and related records. | `/products/:handle` and `/catalog/:handle` |
| COA information | Lot documentation and source PDF display only when a complete approved lot is published. | Product tabs and `/coa-library` |
| Cart and checkout | Editable cart, research-order summary, checkout data form, and handoff to the active provider’s checkout URL. | `/cart`, `/checkout` |
| Customer account patterns | Profile dashboard, sign-out, order-history route, and order-detail empty/authorization states ready for provider-backed orders. | `/account`, `/account/orders`, `/account/orders/:id` |
| Public service pages | Contact form, about dossier, and the full legal-policy route family. | `/contact`, `/about`, `/policies/*` |

## Boundary for production credentials

The visual gate and account flow are functional preview adapters with Cellova-specific browser storage. Before accepting real customer data, replace the preview access adapter with the selected provider’s customer-account API. Shopify and Medusa catalog, cart, and checkout provider selection remains isolated in the server-side commerce adapter and does not change the React storefront UI.
