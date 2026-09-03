import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/commerce/config";

/**
 * Robots directives. Public catalog content is fully crawlable;
 * private transactional routes are disallowed. No user-agent-specific
 * content rules are used anywhere in this application.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cart", "/checkout", "/account", "/account/orders"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
