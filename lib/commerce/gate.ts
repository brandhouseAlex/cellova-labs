import "server-only";
import { readCustomerSession } from "@/lib/customer-session";

export async function requireCatalogAccess() {
  if (process.env.CATALOG_GATE_ENABLED !== "true") return true;
  return Boolean(await readCustomerSession());
}
