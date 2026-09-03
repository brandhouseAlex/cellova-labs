/** Public information remains reachable without opening a research account. */
export function isPublicInformationRoute(path: string): boolean {
  return path === "/about" || path === "/contact" || path.startsWith("/policies/");
}

export function hasApprovedResearchAccess(status: "pending" | "approved" | undefined): boolean {
  return status === "approved";
}

export function resolveResearchAccess(path: string, status: "pending" | "approved" | undefined): "public" | "pending" | "gated" | "approved" {
  if (isPublicInformationRoute(path)) return "public";
  if (status === "approved") return "approved";
  if (status === "pending") return "pending";
  return "gated";
}
