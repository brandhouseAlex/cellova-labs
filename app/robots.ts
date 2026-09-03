import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots { const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cellovalabs.com"; return { rules: { userAgent: "*", allow: ["/", "/shop", "/collections/", "/products/", "/coa-library"], disallow: ["/account", "/api/"] }, sitemap: `${base}/sitemap.xml` }; }
