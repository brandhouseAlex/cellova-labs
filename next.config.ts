import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Shopify product and collection images are served from the Shopify CDN.
    // The provider continues to use only the Storefront API public token.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      // User-approved original product compositions uploaded for this storefront.
      { protocol: "https", hostname: "files.manuscdn.com" },
      // { protocol: "https", hostname: "your-medusa-files.example.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
