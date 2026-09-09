# Production Access Validation

## Registration Integration Attempt

The reauthorized production Shopify Admin path successfully progressed far enough to invoke the `customerCreate` mutation. The mutation returned a Shopify user-input validation result. The public endpoint returned its intended generic HTTP 400 response and did not create a Cellova session or unlock any gated route.

The logged diagnostic contains only an allowlisted category indicating `customer_create` and an input-level rejection. It does not contain a test email, name, phone number, company, customer identifier, error message, field value, credential, token, customer record, metaobject record, product, order, or upstream response body.

The next corrective step is to isolate the safe input-field category and use a production-valid non-personal test value before testing the required metaobject/reference/completion sequence.

## Completed Validation

After applying standards-based E.164 parsing and normalization, an authorized non-personal registration completed successfully through the canonical production domain. Repeating the exact same registration completed successfully, confirming the customer and registration persistence flow is idempotent rather than creating a second account. A server-side eligibility request for that completed test account returned an OAuth authorization URL and an encrypted OAuth transaction cookie with `HttpOnly` and `SameSite=Lax` controls.

An unknown address received the required generic denial text and no OAuth transaction cookie. Invalid OAuth callback state was redirected to the public access route. Logout with a stale session cookie cleared the encrypted session and OAuth cookies and redirected to the canonical access route.

Logged-out direct requests to `/`, `/products/aod-9604`, `/collections/vials`, `/shop`, `/coa-library`, `/cart`, `/checkout`, `/account`, and `/account/orders` each redirected to `/access` before protected content rendered. The approved public access and informational routes remained reachable. Browser bundle inspection found no server-only Shopify credential name, session-secret name, client-secret marker, or PKCE verifier marker in `.next/static`.

Desktop and mobile viewport inspection confirms the existing Cellova gate composition, visual design, branding, responsive layout, passwordless form, and mandatory research-use consent control are preserved at `/access`.

## Customer Account Email-Code Limitation

The pre-authentication gate, PKCE authorization start, encrypted transaction cookie, invalid callback rejection, ID-token verification path, second server-side eligibility check, session minting logic, and logout behavior have automated regression coverage. The site owner subsequently completed the live Customer Account email-code flow and confirmed that it works correctly. No Shopify access token, ID token, or session was surfaced or retained during validation.

## Clean Deployment

The final clean release, including strict phone validation, removed operation-level diagnostics, disabled mock-provider customer authentication, and removed hard-coded account-page session markers, reached Vercel production Ready. No temporary schema-verification route or diagnostic endpoint remains in the deployed application.
