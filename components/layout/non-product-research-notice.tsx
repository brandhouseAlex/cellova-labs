"use client";

import { usePathname } from "next/navigation";
import { ResearchUseNotice } from "@/components/research/research-use-notice";

/** Shared site footer-adjacent notice: intentionally excluded from product pages. */
export function NonProductResearchNotice() {
  const pathname = usePathname();
  if (pathname.startsWith("/products")) return null;
  return <section className="bg-paper py-8 sm:py-10"><div className="home-page-container"><ResearchUseNotice variant="prominent" /></div></section>;
}
