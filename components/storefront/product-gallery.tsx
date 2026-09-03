"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";
import type { ProductImage } from "@/lib/commerce/types";

export function ProductGallery({ images, title }: { images: ProductImage[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0); const active = images[activeIndex];
  return <div><div className="relative grid aspect-square place-items-center overflow-hidden rounded-2xl bg-white p-8 sm:p-12">{active ? <Image src={active.url} alt={active.altText ?? title} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain p-8" /> : <div className="text-center"><ImageOff className="mx-auto text-[color:var(--slate)]" size={36} strokeWidth={1.3} /><p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-[color:var(--muted)]">Image pending</p></div>}</div>{images.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto pb-1">{images.map((image, index) => <button key={`${image.url}-${index}`} onClick={() => setActiveIndex(index)} aria-label={`Show product image ${index + 1}`} className={`relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border bg-white ${index === activeIndex ? "border-[color:var(--spark)]" : "border-[color:var(--line)]"}`}><Image src={image.url} alt="" fill sizes="64px" className="object-contain p-1" /></button>)}</div>}</div>;
}
