import express from "express";
import { type Server } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

/** Creates the provider-neutral API surface used by both Node and Vercel runtimes. */
export function createCellovaApp() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
  return app;
}

/** Attaches the frontend only for the self-hosted Node process; Vercel serves `dist/public` separately. */
export async function attachCellovaFrontend(app: ReturnType<typeof createCellovaApp>, server: Server) {
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
    return;
  }
  serveStatic(app);
}
