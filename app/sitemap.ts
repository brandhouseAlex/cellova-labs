import type { MetadataRoute } from "next";
import { commerce } from "@/lib/commerce";
import { siteUrl } from "@/lib/commerce/config";

/**
 * Dynamic sitemap. Includes only public, indexable routes — cart,
 * checkout, and account routes are intentionally excluded.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticDefs: Array<{
    path: string;
    priority: number;
    changeFrequency:
      | "weekly"
      | "daily"
      | "monthly"
      | "yearly";
  }> = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/products", priority: 0.9, changeFrequency: "daily" },
    { path: "/collections", priority: 0.8, changeFrequency: "weekly" },
    { path: "/coa-library", priority: 0.7, changeFrequency: "daily" },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
    { path: "/policies/research-use", priority: 0.4, changeFrequency: "yearly" },
    { path: "/policies/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/policies/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/policies/shipping", priority: 0.3, changeFrequency: "yearly" },
    { path: "/policies/returns", priority: 0.3, changeFrequency: "yearly" },
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticDefs.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  let collectionRoutes: MetadataRoute.Sitemap = [];

  try {
    const [products, collections] = await Promise.all([
      commerce.getProducts({ perPage: 500 }),
      commerce.getCollections(),
    ]);

    productRoutes = products.items.map((product) => ({
      url: `${siteUrl}/products/${product.handle}`,
      lastModified: product.updatedAt
        ? new Date(product.updatedAt)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    collectionRoutes = collections.map((collection) => ({
      url: `${siteUrl}/collections/${collection.handle}`,
      lastModified: collection.updatedAt
        ? new Date(collection.updatedAt)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // If the provider is unavailable at build time, still emit static routes.
  }

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
