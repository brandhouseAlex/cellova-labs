import type { CommerceImage, CommerceProduct } from "@/lib/commerce/types";

/**
 * Presentation-only mapping for user-supplied original product photography.
 * A match never changes provider title, price, description, availability, or
 * variants. Unknown records continue to render their provider media verbatim.
 */
const ORIGINAL_PRODUCT_IMAGES = [
  { titles: ["bpc-157", "bpc 157"], url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663938836977/USyLoFksqcyKXJTv.webp", alt: "Cellova Labs BPC-157 capsule bottle" },
  { titles: ["night time serum", "noctura"], url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663938836977/iNFPyAHYuBglIDTL.png", alt: "Cellova Labs Night Time Serum" },
  { titles: ["ipamorelin"], url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663938836977/uMBuGrdqAoFXAFrr.webp", alt: "Cellova Labs Ipamorelin vial" },
  { titles: ["nasal spray"], url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663938836977/ivCPJwyolnitDVCK.png", alt: "Cellova Labs nasal spray" },
  { titles: ["formula rg-5555", "formula rg 5555"], url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663522951213/KskyeMGiTVtrtmoQ.webp", alt: "Cellova Labs Formula RG-5555 capsule bottle" },
] as const;

export function getPresentationImage(product: CommerceProduct): CommerceImage | null {
  const title = product.title.toLowerCase();
  const match = ORIGINAL_PRODUCT_IMAGES.find((entry) =>
    entry.titles.some((candidate) => title.includes(candidate))
  );
  return match ? { url: match.url, altText: match.alt } : product.featuredImage;
}
