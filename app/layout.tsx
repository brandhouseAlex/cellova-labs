import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Sora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { siteName, siteUrl } from "@/lib/commerce/config";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { StoreProviders } from "@/components/layout/store-providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ResearchGate } from "@/components/gate/research-gate";
import { StickyCartLauncher } from "@/components/cart/sticky-cart-launcher";
import { NonProductResearchNotice } from "@/components/layout/non-product-research-notice";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Research-Grade Peptides & Laboratory Materials`,
    template: `%s | ${siteName}`,
  },
  description:
    "Cellova Labs supplies research-grade peptides, blends, and laboratory materials with independent third-party analytical verification. Research use only.",
  alternates: { canonical: siteUrl },
  icons: {
    icon: [{ url: "/brand/cellova-favicon.webp", type: "image/webp" }],
    apple: [{ url: "/brand/cellova-favicon.webp" }],
  },
  openGraph: {
    siteName,
    type: "website",
    url: siteUrl,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd(), websiteJsonLd()]),
          }}
        />
        <StoreProviders>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
          >
            Skip to main content
          </a>
          <SiteHeader />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <NonProductResearchNotice />
          <SiteFooter />
          <StickyCartLauncher />
          <ResearchGate />
        </StoreProviders>
      </body>
    </html>
  );
}
