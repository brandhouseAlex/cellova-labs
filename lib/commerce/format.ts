import type { Money } from "./types";

export function formatMoney(money: Money) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: money.currencyCode, maximumFractionDigits: 2 }).format(Number(money.amount));
}

export function priceLabel(range: { min: Money; max: Money }) {
  const min = formatMoney(range.min); const max = formatMoney(range.max);
  return min === max ? min : `From ${min}`;
}
