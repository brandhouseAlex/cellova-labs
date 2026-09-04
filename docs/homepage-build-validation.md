# Cellova Homepage Build Validation

The homepage hero, assurance strip, and research-formats sections are implemented behind the existing global research-access gate. A public local screenshot correctly presents the gate before homepage content, so an authenticated preview session is required for visual review of the new homepage composition. The gate behavior was intentionally preserved and not bypassed for the homepage update.

## Authenticated visual acceptance

At **1732 × 1142**, the authenticated homepage presents the reference-matched composition: navigation, left-aligned research label and headline, proof chips, catalog and COA actions, an explicitly labeled hero-image placeholder, a four-item assurance strip, and the research-formats introduction with four category cards. Every action retains a working route destination.

At **390 × 844**, the layout stacks cleanly into a mobile hierarchy. The headline, proof chips, primary and secondary actions, and labeled hero placeholder remain visible without horizontal overflow; assurance and research-format content follow below the viewport in their responsive layouts.

> Image slots are deliberately labeled placeholders. They can be replaced with approved Cellova imagery later without changing the content hierarchy or the category links.

## Interaction and route verification

The new homepage controls retain visible keyboard focus. In an authenticated preview, the **Browse Peptides** hero action received `:focus-visible` and navigated by native Enter activation to `/products`. The **Vials** research-format card also received `:focus-visible` and navigated by native Enter activation to `/collections/vials`.

Post-update route checks returned successful local responses for `/products`, `/account`, `/cart`, and `/checkout`. The homepage update did not modify the global research gate, cart store, account behavior, or commerce-provider boundary.

An authenticated preview confirmed the preserved commerce path: the active `/products/bpc-157` route rendered its product title and Add to Cart control, `/cart` rendered its cart and checkout control, and `/checkout` rendered its checkout heading. In a cleared session, the `.gate-shell` container was confirmed on `/products`, `/account`, `/cart`, and `/checkout`, preserving the protected-route boundary.

Keyboard verification covered every new homepage destination. **Browse Peptides** navigated to `/products`; **View COA Library** navigated to `/coa-library`; and Vials, Capsules, Serums, and Nasal Sprays navigated to their respective collection routes. Each focused control received `:focus-visible` before native Enter activation.

## End-to-end authenticated commerce flow

The authenticated local flow was explicitly exercised in sequence after the homepage update:

| Step | Result |
| --- | --- |
| Homepage | Rendered **Precision you can verify.** |
| Browse Peptides action | Activated and navigated to `/products`. |
| Catalog product | Selected **BPC-157** and opened `/products/bpc-157`. |
| Add to Cart | Activated successfully from the product page. |
| Cart | Opened `/cart`; BPC-157 and a checkout control were present. |
| Checkout | Checkout control activated and navigated to `/checkout`. |

This confirms that the new homepage content does not interrupt the existing authenticated catalog and mock-provider cart flow.
