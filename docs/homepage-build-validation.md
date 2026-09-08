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

## Refinement-pass validation

The latest refinement pass was checked on the local native Next.js preview at **1280 × 720** and **375 × 812**. The desktop review covered the homepage, About, COA Library, and `/products/bpc-157`; the small-screen review covered the About, COA Library, and BPC-157 routes.

| Surface | Verified refinement |
| --- | --- |
| Homepage | Hero proof chips now read **USA Made**, **Third-party tested**, and **COAs available**; the service band has three cards, uses **Next-Day Shipping** wording, and presents a flask icon for Standards Matter. Research Ordering is absent. |
| Navigation and footer | **Sprays** appears after Serums. The supplied Cellova dark-background wordmark loads from the native public brand path. Mobile navigation/footer link groups form two columns per row. |
| Product grids and PDP | Product cards use rounded image frames and a non-overlapping **RUO** marker. BPC-157 displays the simplified indigo-outlined gallery, circular icon-only cart launcher behavior, no “You may also research” rail, and featured cards with live product images. |
| Product information | At the mobile breakpoint, Certificate of Analysis (when available), Storage Instructions, and FDA Disclosure render as vertically stacked documentation panels. |
| COA Library and About | The COA page uses the requested batch-specific Cellova copy and the Library code lists every complete assigned COA independently. The public About page has the new Cellova research-context composition. |

Final automated validation passed: TypeScript check, five Vitest files with nine tests, ESLint, and the native production build.

The post-refinement suite now includes a keyboard regression test for the desktop PDP documentation tablist. Focus plus native Enter activation changes the selected state from Certificate of Analysis to FDA Disclosure & Intended Use, while the responsive mobile composition remains intentionally stacked.

## Brand and supplied-media alignment

The latest visual pass replaces the Research Formats placeholders with the four supplied Cellova product images: Ipamorelin for Vials, BPC-157 for Capsules, Noctura for Serums, and NAD+ Nasal Spray for Nasal Sprays. This is a presentation-only mapping: catalog titles, prices, variants, availability, and provider records remain unchanged.

The homepage hero, assurance strip, and Research Formats section now consistently use **Spark `#F2A63C`**, **Indigo `#2D3452`**, and **Slate `#8B93A7`** as the visible brand accents. Desktop and mobile screenshot reviews confirmed that the Research Formats imagery remains contained and legible, product media uses zero padding inside its square frames, and every product-grid RUO marker sits at the image’s top-left without overlapping primary product details.

The public heading audit found no remaining H1–H6 elements with a `font-mono` or `font-sans` override. The prior policy-document H3 mono exception now uses the shared Cellova Sora display stack, while metadata, badge, and technical labels deliberately remain in their compact non-heading styles.
