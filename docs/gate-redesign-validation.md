# Cellova Access Gate Validation

## Visual verification

Desktop local rendering at `1536 × 1024` confirms an exact two-column 50/50 presentation: a Cellova Ink left panel with the supplied dark-background wordmark, structured orbital composition, four trust items, and a Paper right panel with the functional login surface. No product, COA, laboratory, or stock photography appears in the gate.

Mobile local rendering at `390 × 844` confirms that the account form appears first, remains within the viewport without horizontal overflow, retains the actual unchecked research-consent checkbox, and preserves the login/create-account segmented control.

## Functional verification

The project’s gate policy and interaction suite confirms that protected catalog, product, collection, account, and COA routes remain gated; public information routes remain exempt; registration cannot submit until consent is checked; full registration metadata is passed to the existing provider; keyboard access reaches the login tab; password visibility toggles; and the saved `cellova.session` key restores an authenticated provider session. The test suite currently contains seven passing tests.

## Motion

The orbital field uses CSS transforms and opacity only, with slow independent ring rotations and node pulses. The global reduced-motion rules plus gate-specific override remove these animations while retaining the static composition.

## Active deployment verification

The supported Vercel production branch URL is `https://cellova-labs-git-main-team-wolfe-e1a668ed.vercel.app/`. The historical hash deployment URL previously shared for the project is not treated as a supported production address because it is immutable and belongs to an older deployment.

| Route | Result on active post-redesign deployment |
| --- | --- |
| `/` | `200` — redesigned research-access gate is rendered. |
| `/products/bpc-157-10mg` | Live visual verification confirms the protected product page remains covered by the redesigned gate. |
| `/collections` | `200` — collection index remains protected. |
| `/collections/research-peptides` | The redesigned gate remains visible over this dynamic path. The underlying collection reports its existing provider-level “Collection Not Found” result because the active provider has no matching live record; the gate redesign did not alter provider catalog data. |
| `/account` | `200` — account route remains protected. |
| `/coa-library` | `200` — documentation route remains protected. |

Live visual checks confirm that the active redesigned gate covers both the account and COA Library pages before authentication. The underlying pages retain their existing account and provider-backed COA content; no customer information or lot documentation is exposed through the gate.

## Reference-match acceptance

The final gate-reference pass was reviewed locally at 1536 × 1024 and 390 × 844 after the last layout refinements. The desktop composition matches the supplied dark/light split, left hierarchy, orbital placement, four-item trust row, lower divider/footer, and right-side access form treatment. The mobile composition retains a form-first stack with no horizontal overflow. See [`gate-reference-audit.md`](./gate-reference-audit.md) for the exact corrections.
