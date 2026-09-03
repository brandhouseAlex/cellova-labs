# Cellova Access Gate Validation

## Visual verification

Desktop local rendering at `1536 × 1024` confirms an exact two-column 50/50 presentation: a Cellova Ink left panel with the supplied dark-background wordmark, structured orbital composition, four trust items, and a Paper right panel with the functional login surface. No product, COA, laboratory, or stock photography appears in the gate.

Mobile local rendering at `390 × 844` confirms that the account form appears first, remains within the viewport without horizontal overflow, retains the actual unchecked research-consent checkbox, and preserves the login/create-account segmented control.

## Functional verification

The project’s gate policy and interaction suite confirms that protected catalog, product, collection, account, and COA routes remain gated; public information routes remain exempt; registration cannot submit until consent is checked; full registration metadata is passed to the existing provider; keyboard access reaches the login tab; password visibility toggles; and the saved `cellova.session` key restores an authenticated provider session. The test suite currently contains seven passing tests.

## Motion

The orbital field uses CSS transforms and opacity only, with slow independent ring rotations and node pulses. The global reduced-motion rules plus gate-specific override remove these animations while retaining the static composition.
