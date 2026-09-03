# Research Account Approval Boundary

The current Cellova gate deliberately distinguishes **registration** from **catalog approval**. A new registration is saved as `pending`; pending accounts remain behind the global gate and cannot view catalog, product, cart, checkout, or account-order pages. An account becomes eligible only when its status is `approved`.

This behavior is intentionally conservative in the source package because no Cellova customer-account or approval-service credentials were supplied. The browser preview adapter stores request state locally so the gate, pending state, sign-in, and account UI can be tested without transmitting customer information.

## Required production replacement

Before launch, replace the preview access adapter in `client/src/contexts/ResearchAccessContext.tsx` with the chosen provider-backed customer workflow. The provider must create an account request, store review status server-side, expose an approved/pending decision to the storefront, and issue an authenticated customer session. Do not treat browser-local status as a production authorization mechanism.

| State | Preview behavior | Required production behavior |
| --- | --- | --- |
| New request | Stored locally as `pending` | Persisted with the approved customer or account-review system. |
| Pending | Gate stays visible; catalog remains blocked. | Same; present a review status and customer-support path. |
| Approved | Supported by the access-state contract. | Issued only by the authorized review workflow and bound to an authenticated session. |
| Orders and inquiries | Stored locally as continuity records. | Persisted in the active provider or approved Cellova service. |
