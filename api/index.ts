import { createCellovaApp } from "../server/_core/app";

/**
 * Vercel serverless entry. Static storefront files are published from
 * `dist/public`; this function handles tRPC, OAuth, storage proxy, and API routes.
 */
const app = createCellovaApp();

export default app;
