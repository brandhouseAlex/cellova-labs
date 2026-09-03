/**
 * Visual style: centralized Cellova storefront configuration.
 * Keep public, environment-dependent values here so a separate deployment
 * can change domain and contact details without altering product UI.
 */
export const CELLLOVA_ASSETS = {
  wordmark: "/manus-storage/cellova-labs-wordmark_9400de77.webp",
  hero: "/manus-storage/cellova-hero-research-vials_8ed6e3c2.png",
  product: "/manus-storage/cellova-product-vial-still-life_6e130cf1.png",
  documentation: "/manus-storage/cellova-documentation-lab-still_ebac6f90.png",
  mark: "/manus-storage/cellova-calibration-mark_ebdbe82d.png",
} as const;

export const CELLLOVA_SITE = {
  name: "Cellova Labs",
  url: import.meta.env.VITE_SITE_URL?.replace(/\/+$/, "") || "",
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || "",
  description:
    "Research-use materials with clear specifications and organized lot documentation.",
} as const;

export const formatMoney = (amount: string, currencyCode: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(Number(amount));

export function usePageMeta(title: string, description: string) {
  React.useEffect(() => {
    document.title = `${title} | Cellova Labs`;
    const descriptionMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    if (descriptionMeta) descriptionMeta.content = description;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = `${CELLLOVA_SITE.url || window.location.origin}${window.location.pathname}`;
  }, [title, description]);
}

import React from "react";
