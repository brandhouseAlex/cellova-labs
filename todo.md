# Cellova Labs Next.js Source Replacement

- [x] Preserve the supplied original Next.js storefront as an untouched local baseline and inventory its architecture.
- [x] Replace the prior Cellova project source with an independent copy of the original Next.js storefront while preserving the Cellova repository metadata.
- [x] Rebrand copied source text, configuration comments, metadata, assets, component references, and documentation from the legacy brand to Cellova Labs.
- [x] Replace legacy design tokens with the official Cellova Ink, Paper, Slate, Indigo, Spark, Sora, Inter, and IBM Plex Mono system.
- [x] Replace legacy logo/image paths with the supplied Cellova wordmark and update favicon metadata.
- [x] Verify the original route structure, gating, cart, product, collection, COA Library, and dynamic Shopify/Medusa provider abstraction remain intact.
- [x] Run dependency installation, TypeScript validation, linting, and the native production Next.js build.
- [x] Audit source files case-insensitively for legacy branding, legacy asset names, Liquid/theme files, credentials, and obsolete Vercel configuration.
- [x] Exercise a dynamic product, collection, COA Library, and cart flow in the copied Next.js storefront and record the results.
- [x] Run a focused source and configuration-template audit for embedded tokens, private credentials, and legacy provider identifiers.
- [x] Confirm `.env.example` contains placeholder-only Shopify, Medusa, and payment settings; the sole Shopify domain reference in source is a validation example, not a configured store.
- [ ] Replace the Cellova GitHub repository contents with the tested extracted Next.js application and confirm its Vercel detection readiness.
