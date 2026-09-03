import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "@/components/storefront/footer";
import { Header } from "@/components/storefront/header";
import { CartProvider } from "@/components/storefront/cart-provider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cellovalabs.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Cellova Labs | Precision You Can Verify.", template: "%s | Cellova Labs" },
  description: "Clear specifications, organized documentation, and dependable research support.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Cellova Labs",
    title: "Cellova Labs | Precision You Can Verify.",
    description: "Clear specifications, organized documentation, and dependable research support.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#12141C", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
