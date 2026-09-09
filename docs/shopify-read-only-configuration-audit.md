# Shopify Read-Only Configuration Audit

**Scope:** This document records findings from an authenticated, read-only Shopify Admin inspection. No Shopify setting, app configuration, customer, metafield, metaobject, product, or other store data was modified.

## Verified Customer Registration Reference

| Requested value | Observed Shopify Admin value |
| --- | --- |
| Customer metafield display name | `Customer Registration` |
| Namespace and key | `custom.customer_registration` |
| Metafield cardinality | One value |
| Metafield type | Metaobject reference |
| Allowed referenced metaobject definition | `Customer Registration` |
| Storefront API access | Disabled |
| Customer Account API access | No access |
| Current usage | 0 customers |

The Admin UI confirms the reference exists and is a **single metaobject reference**, so a compliant server implementation must set the `custom.customer_registration` metafield to the referenced metaobject global ID. It must not expose this field through the storefront or Customer Account API.

## Pending Read-Only Checks

## Verified Customer Registration Definition

| Requested value | Observed Shopify Admin value |
| --- | --- |
| Metaobject display name | `Customer Registration` |
| Metaobject API type | `customer_registration` |
| `Business Name` field type | Single line text |
| `Age & Research Consent` field type | True or false |
| `Registration Date & Time` field type | Date and time |
| `Registration Complete` field type | True or false |
| Existing entries | 0 |

The Shopify definition screen does not display the underlying API keys for individual fields in its read-only rendered view. The labels must not be used as a substitute for exact API keys. A safe read-only Admin GraphQL query is the remaining technical verification method, but it can only run from a server runtime that receives the configured Admin credentials; this local environment does not receive those Vercel-only values.

## Verified OAuth Client and App Prerequisites

| Area | Observed value |
| --- | --- |
| Headless storefront | `Cellova Labs Headless` |
| Customer Account client type | Public (web app) |
| Customer Account API application configuration | Available in the Headless storefront’s Customer Account API page |
| Active Dev Dashboard app version scopes | `write_customers`, `write_metaobjects` |
| Customer and metaobject-entry read capability | Shopify documents that each write scope includes the corresponding resource read scope |
| Metaobject-definition read capability | Not granted; Shopify documents `metaobjectDefinitionByType` as requiring `read_metaobject_definitions` |

The active Admin app version has the required customer and metaobject-entry read/write capability through its existing `write_customers` and `write_metaobjects` grants. However, the requested definition query requires the distinct `read_metaobject_definitions` scope. The remaining production prerequisite is the applicable Shopify protected-customer-data approval for non-development data. This audit has not changed the app version or any Shopify configuration. [1] [2]

## Verified Customer Account API Application URLs

| URL class | Configured URL |
| --- | --- |
| Callback URI | `https://cellovalabs.com/customer-account-api/callback` |
| Callback URI | `https://www.cellovalabs.com/customer-account-api/callback` |
| JavaScript origin | `https://cellovalabs.com` |
| JavaScript origin | `https://www.cellovalabs.com` |
| Post-logout URI | `https://cellovalabs.com/access` |
| Post-logout URI | `https://www.cellovalabs.com/access` |

The requested exact production paths are already registered: `https://www.cellovalabs.com/customer-account-api/callback`, `https://www.cellovalabs.com`, and `https://www.cellovalabs.com/access`. The Customer Account client is a public web-app client, so the Cellova implementation must use PKCE. No Customer Account settings were changed during this verification.

## Pending Read-Only Checks

The only remaining schema check is obtaining the exact API keys for the four existing metaobject fields without changing their schema. The rendered Shopify Admin definition screen confirms the type, labels, and field types but does not render the immutable keys.

## Authorized Temporary Verification Result

A temporary, read-only Vercel route was deployed to query only `metaobjectDefinitionByType(type: "customer_registration")` and return only definition type plus field name/key/type records. It returned the fail-closed generic result `verification_unavailable` (HTTP 503). The route intentionally did not return, log, or persist the underlying Shopify response, token, credential, customer, metaobject-entry, product, or order data.

The exact query requires `read_metaobject_definitions`, which is absent from the active app version. The temporary endpoint, its helper, and its test were removed immediately after this authorized attempt. No registration, authentication, Shopify schema, or Shopify data change was made.

## Source

[1] [Shopify, Manage access scopes](https://shopify.dev/docs/apps/build/authentication-authorization/manage-access-scopes)

[2] [Shopify, metaobjectDefinitionByType](https://shopify.dev/docs/api/admin-graphql/latest/queries/metaobjectDefinitionByType)
