import React from "react";
import { LoaderCircle } from "lucide-react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { usePageMeta } from "@/lib/cellova";
import { CollectionDetailContent } from "@/components/storefront/CollectionDetailContent";

export function FunctionalCollectionDetailPage() {
  const [, params] = useRoute<{ handle: string }>("/collections/:handle");
  const handle = params?.handle ?? "";
  const collectionQuery = trpc.commerce.collections.byHandle.useQuery({ handle }, { enabled: Boolean(handle) });
  const productsQuery = trpc.commerce.products.list.useQuery({ first: 50, collectionHandle: handle }, { enabled: Boolean(handle) });
  usePageMeta(collectionQuery.data?.title || "Collection", "Cellova Labs research collection.");
  if (collectionQuery.isLoading || productsQuery.isLoading) return <main className="page-main"><div className="site-width loading-page"><LoaderCircle className="spin" />Loading collection…</div></main>;
  if (!collectionQuery.data) return <main className="page-main"><div className="site-width not-found-panel"><p className="eyebrow">COLLECTION</p><h1>This collection is unavailable.</h1></div></main>;
  return <CollectionDetailContent collection={collectionQuery.data} products={productsQuery.data ?? []} />;
}
