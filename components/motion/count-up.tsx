"use client";

import { useState } from "react";

/**
 * Stateless, reliable statistic display. Section movement and hover states
 * provide the site motion; this component deliberately renders its final
 * numeric value in the first HTML paint so statistics never appear as zero.
 */
export function CountUp({
  value,
  decimals = 0,
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const [display] = useState(value);

  return (
    <span className={className}>
      {display.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
