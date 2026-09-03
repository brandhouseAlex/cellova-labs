export type GateMode = "login" | "register";

/** Public informational pages remain outside the account gate. */
export function isPublicGateRoute(pathname: string): boolean {
  return pathname === "/about" || pathname === "/contact" || pathname.startsWith("/policies/");
}

/** Registration requires an explicit research-use acknowledgement; login does not. */
export function canSubmitGate(mode: GateMode, acknowledged: boolean, busy: boolean): boolean {
  return !busy && (mode === "login" || acknowledged);
}
