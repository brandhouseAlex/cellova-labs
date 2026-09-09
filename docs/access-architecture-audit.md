# Cellova Research Access Architecture Audit

**Status:** Pre-implementation audit. No server-authentication, Shopify Admin registration, OAuth, session, or route-protection code has been added by this work.

## Current Architecture

Cellova is a native Next.js 16 App Router storefront with a provider-neutral commerce layer. The Shopify adapter currently serves catalog, collection, cart, and checkout interactions through the Storefront API. That adapter should remain intact because it does not contain Customer Account or Admin authentication logic.

The present research gate is a **client-rendered visual overlay**, not a server access boundary. `app/layout.tsx` renders the full header, route page, footer, cart launcher, and then `ResearchGate` globally. Therefore, an unauthenticated visitor can receive the HTML/RSC payload for a protected page beneath the overlay. There is no `middleware.ts`, `proxy.ts`, protected server layout, or Next route handler in the project.

The gate is driven by `lib/auth/auth-store.tsx`. On startup, that client store reads `cellova.session` from `localStorage`, passes it to the active commerce provider, and considers a returned customer authenticated. The mock provider can create or accept a mock customer using only an email address, then the client writes `mock_session` to local storage. This is a development/demo behavior and is not suitable for a real access decision.

The passwordless UI checkpoint `b16c446` correctly removed the password fields and made registration consent mandatory in the gate. It changed only the presentation and mock-client semantics; it does **not** create Shopify customers, verify a registration metaobject, enforce a server session, implement OAuth/PKCE, or protect response payloads.

| Existing area | Current behavior | Security/compatibility conclusion |
| --- | --- | --- |
| `app/layout.tsx` | Globally renders the full storefront before the client gate overlay. | Must cease being the protection mechanism. |
| `components/gate/research-gate.tsx` | Preserves the approved Cellova visual design; directly calls client auth-store login/register. | Retain its design, redirect it to server endpoints, and make it the content of a public `/access` page. |
| `lib/auth/auth-store.tsx` | Trusts browser local storage and provider mock authentication. | Replace with read-only server-session state and server logout. |
| `lib/auth/gate-policy.ts` | Client-only public-route policy. | Replace or reduce after server route policy exists. |
| `lib/commerce/providers/shopify/index.ts` | Storefront API product/collection/cart implementation. | Preserve unchanged; no Admin secret or Customer Account token may be added here. |
| `components/account/auth-forms.tsx` | Separate account form still contains password and mock-provider assumptions. | Align with the same passwordless server/OAuth flow or route users to `/access`. |

## Intended File Boundaries

The following is the expected change set; exact names may be refined after Shopify metaobject schema and environment prerequisites are verified.

| Change | Purpose |
| --- | --- |
| `proxy.ts` and protected server route/layout helpers | Perform early redirect checks for gated paths; pair this with server-side page/layout checks so protected catalog data is not rendered before a valid Cellova session is verified. |
| `app/access/page.tsx` | Public `/access` route that reuses the existing Cellova gate design instead of rendering it globally above every page. |
| `app/api/access/register/route.ts` | Validate/normalize registration input and perform idempotent, server-only Shopify Admin customer/metaobject persistence. |
| `app/api/access/eligibility/route.ts` | Return a generic outcome and initiate OAuth only after server-side completed-registration verification. |
| `app/api/access/session/route.ts` and `app/api/access/logout/route.ts` | Expose only derived session state to the client and clear the HttpOnly Cellova session on logout. |
| `app/customer-account-api/auth/route.ts` and `app/customer-account-api/callback/route.ts` | Start Shopify Customer Account authorization using dynamic OIDC discovery, state, and PKCE; validate the callback, re-check registration eligibility, then mint a Cellova session. |
| `lib/server/shopify-admin.ts` | Server-only client-credentials token acquisition/cache and typed Admin GraphQL boundary. |
| `lib/server/registration.ts` and `lib/server/eligibility.ts` | Normalize exact email/phone input; query one customer; create/update customer, registration metaobject, and reference metafield in safe completion order. |
| `lib/server/customer-account-oidc.ts` | OIDC discovery, PKCE state/verifier creation and validation, token exchange, identity proof, and provider logout handling. |
| `lib/server/session.ts`, `lib/server/rate-limit.ts`, and durable storage adapter | HttpOnly session cookies, durable OAuth transaction/session records, and production-safe rate limits. |
| `components/gate/research-gate.tsx`, `lib/auth/auth-store.tsx`, `components/layout/store-providers.tsx`, `components/account/auth-forms.tsx`, and tests | Connect existing UI to the new server flow; remove client-trusted state and reconcile all account entry points. |
| `todo.md`, technical docs, and focused Vitest suites | Track implementation, document environment/schema assumptions, and test registration, eligibility, OAuth, session, redirect, and storefront regressions. |

## Verified Constraints and Prerequisites

The local development environment contains the existing `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_API_ACCESS_TOKEN`, but does not contain the three stated Shopify Admin variables or the Customer Account client ID. No secret values were accessed or logged. The Vercel project was safely confirmed as `Team Wolfe / cellova-labs`: `SHOPIFY_ADMIN_CLIENT_ID`, `SHOPIFY_ADMIN_SHOP`, and `NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID` are present for all environments, while `SHOPIFY_ADMIN_CLIENT_SECRET` is present as a secret for Production, Preview, and Development. Vercel's authenticated dashboard verified the configured production domains as `cellovalabs.com` (redirecting to `www.cellovalabs.com`), `www.cellovalabs.com` (Production), and `cellova-labs-psi.vercel.app` (Production). No variable values were viewed or recorded.

There are still no existing API routes, middleware/proxy, or durable authentication/PKCE/rate-limit storage implementation in the codebase.

The registered production origin and callback must be reconciled before OAuth code is enabled. The requested `https://cellovalabs.com/customer-account-api/callback` configuration needs to match the domain currently serving the application; the Vercel aliases are not interchangeable with an OAuth redirect URI unless they are explicitly registered. The precise Customer Registration metaobject **definition type and field keys**, plus the `custom.customer_registration` metafield definition type, must also be discovered from the Shopify Admin schema or supplied by the store owner. Display labels alone are insufficient to safely write Shopify data.

Finally, serverless production requires durable storage for rate limits, PKCE transactions, and sessions. Process memory is not adequate. The Vercel project storage panel currently reports no attached storage/database service. The design will therefore require an approved persistent backend such as Vercel KV/Upstash Redis or an existing database before live access can be securely enabled.

## Sources

[1] [Shopify, Authenticate customers with the Customer Account API](https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/authenticate-customers)

[2] [Shopify, Manage app credentials](https://shopify.dev/docs/apps/build/authentication-authorization/manage-credentials)

[3] [Shopify Admin GraphQL, `metafieldsSet`](https://shopify.dev/docs/api/admin-graphql/latest/mutations/metafieldsSet)
