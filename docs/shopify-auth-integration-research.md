# Shopify Authentication and Registration Integration Research

This note captures the official Shopify requirements reviewed before designing the requested server-enforced Cellova access system.

| Area | Verified implementation requirement | Source |
| --- | --- | --- |
| Customer Account authentication | Use OAuth 2.0 authorization code flow with PKCE, dynamically discover customer-account endpoints from the shop OpenID configuration, generate a state value and code verifier, and validate them at callback. | [Shopify Customer Account API authentication](https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/authenticate-customers) |
| Customer data access | Customer Account API access requires the appropriate customer scopes and Shopify protected-customer-data approval for name and email in applicable production configurations. | [Shopify Customer Account API authentication](https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/authenticate-customers) |
| App credentials | App client credentials identify/authorize OAuth calls. The client secret must remain server-only and never be committed or exposed to frontend code. | [Shopify credential management](https://shopify.dev/docs/apps/build/authentication-authorization/manage-credentials) |
| Customer registration reference | The Admin GraphQL `metafieldsSet` mutation can create or update a typed metafield and is atomic: an error means no mutation in that request persists. It supports compare-and-set digests for concurrency protection. | [Shopify Admin GraphQL metafieldsSet](https://shopify.dev/docs/api/admin-graphql/latest/mutations/metafieldsSet) |

The requested architecture therefore needs server-only Admin API access for registration persistence, durable server-side state for PKCE and Cellova sessions, generic eligibility responses before initiating the Customer Account flow, and a second eligibility check after Shopify identity authentication. No Shopify credential value is recorded in this repository or this note.

## Additional Implementation Facts

| Topic | Current Shopify requirement | Design consequence |
| --- | --- | --- |
| Server Admin tokens | The client-credentials grant exchanges client ID and secret at `https://{shop}.myshopify.com/admin/oauth/access_token` with `grant_type=client_credentials`. Tokens expire after approximately 24 hours; cache only server-side and refresh before expiry. The grant works only when the app and target store belong to the same Shopify organization. | The app must fail closed with a generic error if the organization/app installation prerequisite is not met. No token, client secret, or Admin request may reach client code. |
| Customer writes | `customerUpdate` requires `write_customers`; creating/updating registration objects requires appropriate metaobject scopes. Shopify documents protected-customer-data requirements for customer personal data. | Confirm the app has `read_customers`, `write_customers`, `read_metaobjects`, and `write_metaobjects` as needed, plus production approval if Shopify requires it. |
| Metaobject correctness | A metaobject must match an existing definition. `metaobjectUpdate` can patch named fields; metaobject handles are unique by type and can support idempotent lookup/upsert patterns. | The integration must discover the real type and field keys before enabling registration. It must not infer keys from display labels. |
| Customer Account OAuth | The storefront's `/.well-known/openid-configuration` declares the authorization, token, end-session, JWKS, and issuer URLs. Shopify requires an explicitly registered redirect URI, state, and a `nonce`; public clients use PKCE S256. The access-token request uses the same redirect URI and code verifier. | Start OAuth at a Cellova route after eligibility passes. Keep state, nonce, PKCE verifier, original safe return path, and one-time status in durable server storage—not browser storage. Validate state, expiry, nonce, token issuer/audience/signature, and identity before creating a Cellova session. |
| Customer Account logout | Shopify requires redirecting to the discovered `end_session_endpoint` with `id_token_hint` and a registered post-logout redirect URI. | First revoke/delete the server Cellova session, then redirect through Shopify logout when an ID token is available; otherwise end locally at `/access`. |
| Session continuity | A Customer Account app-client authorization code flow does not receive a refresh token. Refresh requires an interactive or `prompt=none` top-level flow while the customer session remains active. | The Cellova session should be deliberately short-lived and server-managed; it should not expose or hand the Customer Account access token to the browser. |

## Sources

[1] [Shopify Customer Account API reference](https://shopify.dev/docs/api/customer/latest)

[2] [Shopify client-credentials grant](https://shopify.dev/docs/apps/build/authentication-authorization/client-credentials-grant)

[3] [Shopify customerUpdate mutation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/customerUpdate)

[4] [Shopify metaobjectUpdate mutation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/metaobjectUpdate)

[5] [Shopify Metaobject object reference](https://shopify.dev/docs/api/admin-graphql/latest/objects/Metaobject)
