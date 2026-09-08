import type { CommerceProduct } from "@/lib/commerce/types";

/** Returns whether a commerce platform's placeholder variant title should be hidden from researchers. */
export function isDefaultVariantTitle(title: string | undefined) {
  return /^(default title|default)$/i.test(title?.trim() ?? "");
}

/** A single platform-default variant adds no meaningful choice to the PDP. */
export function shouldSuppressDefaultVariantDetails(product: Pick<CommerceProduct, "variants">) {
  return product.variants.length === 1 && isDefaultVariantTitle(product.variants[0]?.title);
}
