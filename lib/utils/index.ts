import type { CommerceMoney } from "@/lib/commerce/types";

/** Merge class names, dropping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Format a CommerceMoney value for display. */
export function formatMoney(money: CommerceMoney | null | undefined): string {
  if (!money) return "—";
  const amount = parseFloat(money.amount);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: money.currencyCode || "USD",
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

/** Format an ISO date string for display. */
export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** Human-readable label for order status codes. */
export function formatOrderStatus(status: string): string {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
