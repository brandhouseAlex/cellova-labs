import type { CommerceProduct } from "@/lib/commerce/types";

/**
 * TEMPORARY demo catalog.
 *
 * Everything in `lib/mock-data/` exists only so the storefront can be
 * designed, built, and QA'd before a live commerce backend is connected.
 * Replace by setting COMMERCE_PROVIDER=medusa or COMMERCE_PROVIDER=shopify
 * and delete this directory.
 *
 * All descriptions are intentionally neutral and research-oriented.
 * Do not add medical, therapeutic, or performance claims here.
 */

const USD = "USD";

function money(amount: string) {
  return { amount, currencyCode: USD };
}

interface MockProductSeed {
  handle: string;
  title: string;
  productType: string;
  collections: string[];
  tags: string[];
  description: string;
  specs: {
    sequence?: string;
    molecularFormula?: string;
    molecularWeight?: string;
    form: string;
    storage: string;
  };
  variants: Array<{ title: string; sku: string; price: string }>;
  featured?: boolean;
  createdAt: string;
}

const seeds: MockProductSeed[] = [
  {
    handle: "bpc-157",
    title: "BPC-157",
    productType: "Research Peptide",
    collections: ["research-peptides", "popular-research-products", "all-products"],
    tags: ["pentadecapeptide", "lyophilized", "hplc-tested"],
    description:
      "BPC-157 is a synthetic pentadecapeptide supplied as a lyophilized powder for in-vitro and laboratory investigation. Each batch is identity-confirmed and purity-verified by independent third-party analytical testing prior to release. This material is intended strictly for laboratory research purposes only and is not for human or veterinary use.",
    specs: {
      sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
      molecularFormula: "C62H98N16O22",
      molecularWeight: "1419.5 g/mol",
      form: "Lyophilized powder",
      storage: "Store at -20°C. Protect from light and moisture.",
    },
    variants: [
      { title: "5 mg", sku: "BL-BPC157-5", price: "49.00" },
      { title: "10 mg", sku: "BL-BPC157-10", price: "89.00" },
    ],
    featured: true,
    createdAt: "2026-01-12T00:00:00.000Z",
  },
  {
    handle: "tb-500",
    title: "TB-500",
    productType: "Research Peptide",
    collections: ["research-peptides", "popular-research-products", "all-products"],
    tags: ["thymosin-beta-4-fragment", "lyophilized", "hplc-tested"],
    description:
      "TB-500 is a synthetic peptide fragment corresponding to a region of thymosin beta-4, supplied as a lyophilized powder for controlled laboratory study. Identity and purity are confirmed by third-party analytical testing. For laboratory research purposes only. Not for human or veterinary use.",
    specs: {
      sequence: "Ac-Ser-Asp-Lys-Pro-Asp-Met-Ala-Glu-Ile-Glu-Lys-Phe-Asp-Lys-Ser-Lys-Leu-Lys-Lys-Thr-Glu-Thr-Gln-Glu-Lys-Asn-Pro-Leu-Pro-Ser-Lys-Glu-Thr-Ile-Glu-Gln-Glu-Lys-Gln-Ala-Gly-Glu-Ser",
      molecularFormula: "C212H350N56O78S",
      molecularWeight: "4963.5 g/mol",
      form: "Lyophilized powder",
      storage: "Store at -20°C. Protect from light and moisture.",
    },
    variants: [
      { title: "5 mg", sku: "BL-TB500-5", price: "55.00" },
      { title: "10 mg", sku: "BL-TB500-10", price: "99.00" },
    ],
    featured: true,
    createdAt: "2026-01-12T00:00:00.000Z",
  },
  {
    handle: "ghk-cu",
    title: "GHK-Cu",
    productType: "Research Peptide",
    collections: ["research-peptides", "popular-research-products", "all-products"],
    tags: ["copper-peptide", "tripeptide", "lyophilized"],
    description:
      "GHK-Cu is a naturally occurring copper-binding tripeptide complex produced synthetically for laboratory research applications. Supplied as a lyophilized powder with batch-specific analytical documentation. For laboratory research purposes only. Not for human or veterinary use.",
    specs: {
      sequence: "Gly-His-Lys (Cu²⁺ chelate)",
      molecularFormula: "C14H24CuN6O4",
      molecularWeight: "403.9 g/mol",
      form: "Lyophilized powder",
      storage: "Store at -20°C. Protect from light and moisture.",
    },
    variants: [
      { title: "50 mg", sku: "BL-GHKCU-50", price: "39.00" },
      { title: "100 mg", sku: "BL-GHKCU-100", price: "69.00" },
    ],
    featured: true,
    createdAt: "2026-02-03T00:00:00.000Z",
  },
  {
    handle: "mots-c",
    title: "MOTS-c",
    productType: "Research Peptide",
    collections: ["research-peptides", "new-arrivals", "all-products"],
    tags: ["mitochondrial-derived", "lyophilized", "hplc-tested"],
    description:
      "MOTS-c is a mitochondrial-derived peptide supplied for in-vitro research into cellular metabolism and signaling pathways. Each lot is released only after independent identity and purity verification. For laboratory research purposes only. Not for human or veterinary use.",
    specs: {
      sequence: "Met-Arg-Trp-Gln-Glu-Met-Gly-Tyr-Ile-Phe-Tyr-Pro-Arg-Lys-Leu-Arg",
      molecularFormula: "C101H152N28O22S2",
      molecularWeight: "2174.6 g/mol",
      form: "Lyophilized powder",
      storage: "Store at -20°C. Protect from light and moisture.",
    },
    variants: [
      { title: "10 mg", sku: "BL-MOTSC-10", price: "79.00" },
    ],
    featured: true,
    createdAt: "2026-06-18T00:00:00.000Z",
  },
  {
    handle: "kpv",
    title: "KPV",
    productType: "Research Peptide",
    collections: ["research-peptides", "new-arrivals", "all-products"],
    tags: ["tripeptide", "alpha-msh-fragment", "lyophilized"],
    description:
      "KPV is a C-terminal tripeptide fragment of alpha-melanocyte-stimulating hormone, synthesized for laboratory research use. Supplied as a lyophilized powder with third-party analytical verification of identity and purity. For laboratory research purposes only. Not for human or veterinary use.",
    specs: {
      sequence: "Lys-Pro-Val",
      molecularFormula: "C16H30N4O4",
      molecularWeight: "342.4 g/mol",
      form: "Lyophilized powder",
      storage: "Store at -20°C. Protect from light and moisture.",
    },
    variants: [
      { title: "10 mg", sku: "BL-KPV-10", price: "45.00" },
    ],
    createdAt: "2026-06-18T00:00:00.000Z",
  },
  {
    handle: "selank",
    title: "Selank",
    productType: "Research Peptide",
    collections: ["research-peptides", "all-products"],
    tags: ["heptapeptide", "tuftsin-analog", "lyophilized"],
    description:
      "Selank is a synthetic heptapeptide analog of the immunomodulatory peptide tuftsin, supplied exclusively for laboratory and analytical research. Identity and purity are confirmed by independent third-party testing. For laboratory research purposes only. Not for human or veterinary use.",
    specs: {
      sequence: "Thr-Lys-Pro-Arg-Pro-Gly-Pro",
      molecularFormula: "C33H57N11O9",
      molecularWeight: "751.9 g/mol",
      form: "Lyophilized powder",
      storage: "Store at -20°C. Protect from light and moisture.",
    },
    variants: [
      { title: "10 mg", sku: "BL-SEL-10", price: "52.00" },
    ],
    createdAt: "2026-02-20T00:00:00.000Z",
  },
  {
    handle: "semax",
    title: "Semax",
    productType: "Research Peptide",
    collections: ["research-peptides", "all-products"],
    tags: ["heptapeptide", "acth-fragment", "lyophilized"],
    description:
      "Semax is a synthetic heptapeptide based on a fragment of adrenocorticotropic hormone (ACTH 4-10), supplied for laboratory research applications. Each batch is analytically verified for identity and purity by an independent laboratory. For laboratory research purposes only. Not for human or veterinary use.",
    specs: {
      sequence: "Met-Glu-His-Phe-Pro-Gly-Pro",
      molecularFormula: "C37H51N9O10S",
      molecularWeight: "813.9 g/mol",
      form: "Lyophilized powder",
      storage: "Store at -20°C. Protect from light and moisture.",
    },
    variants: [
      { title: "10 mg", sku: "BL-SEMX-10", price: "52.00" },
    ],
    createdAt: "2026-02-20T00:00:00.000Z",
  },
  {
    handle: "tesamorelin",
    title: "Tesamorelin",
    productType: "Research Peptide",
    collections: ["research-peptides", "all-products"],
    tags: ["ghrh-analog", "lyophilized", "hplc-tested"],
    description:
      "Tesamorelin is a synthetic analog of growth hormone-releasing hormone (GHRH) supplied strictly for laboratory research. The material is lyophilized and released only after third-party confirmation of identity and purity. For laboratory research purposes only. Not for human or veterinary use.",
    specs: {
      molecularFormula: "C221H366N72O67S",
      molecularWeight: "5135.9 g/mol",
      form: "Lyophilized powder",
      storage: "Store at -20°C. Protect from light and moisture.",
    },
    variants: [
      { title: "2 mg", sku: "BL-TESA-2", price: "69.00" },
      { title: "5 mg", sku: "BL-TESA-5", price: "139.00" },
    ],
    createdAt: "2026-03-05T00:00:00.000Z",
  },
  {
    handle: "ipamorelin",
    title: "Ipamorelin",
    productType: "Research Peptide",
    collections: ["research-peptides", "popular-research-products", "all-products"],
    tags: ["pentapeptide", "ghrp", "lyophilized"],
    description:
      "Ipamorelin is a synthetic pentapeptide supplied as a lyophilized powder for laboratory investigation. Batch-specific identity and purity are verified through independent analytical testing prior to release. For laboratory research purposes only. Not for human or veterinary use.",
    specs: {
      sequence: "Aib-His-D-2-Nal-D-Phe-Lys",
      molecularFormula: "C38H49N9O5",
      molecularWeight: "711.9 g/mol",
      form: "Lyophilized powder",
      storage: "Store at -20°C. Protect from light and moisture.",
    },
    variants: [
      { title: "5 mg", sku: "BL-IPA-5", price: "45.00" },
      { title: "10 mg", sku: "BL-IPA-10", price: "79.00" },
    ],
    featured: true,
    createdAt: "2026-01-12T00:00:00.000Z",
  },
  {
    handle: "thymosin-alpha-1",
    title: "Thymosin Alpha-1",
    productType: "Research Peptide",
    collections: ["research-peptides", "all-products"],
    tags: ["28-mer", "immune-research", "lyophilized"],
    description:
      "Thymosin Alpha-1 is a synthetic 28-amino-acid peptide supplied for laboratory and analytical research. Each lot is identity-confirmed and purity-verified by independent third-party testing. For laboratory research purposes only. Not for human or veterinary use.",
    specs: {
      molecularFormula: "C129H215N33O55",
      molecularWeight: "3108.3 g/mol",
      form: "Lyophilized powder",
      storage: "Store at -20°C. Protect from light and moisture.",
    },
    variants: [
      { title: "3 mg", sku: "BL-TA1-3", price: "65.00" },
      { title: "10 mg", sku: "BL-TA1-10", price: "165.00" },
    ],
    createdAt: "2026-03-22T00:00:00.000Z",
  },
  {
    handle: "bpc-157-tb-500-blend",
    title: "BPC-157 / TB-500 Blend",
    productType: "Peptide Blend",
    collections: ["peptide-blends", "popular-research-products", "all-products"],
    tags: ["blend", "lyophilized", "hplc-tested"],
    description:
      "A co-lyophilized research blend of BPC-157 and TB-500 prepared for laboratory investigation requiring both analytes in a single vial. Each component is identity-confirmed and the finished blend is purity-verified by independent third-party testing. For laboratory research purposes only. Not for human or veterinary use.",
    specs: {
      form: "Lyophilized powder (co-lyophilized blend)",
      storage: "Store at -20°C. Protect from light and moisture.",
    },
    variants: [
      { title: "5 mg / 5 mg", sku: "BL-BTB-55", price: "95.00" },
      { title: "10 mg / 10 mg", sku: "BL-BTB-1010", price: "175.00" },
    ],
    featured: true,
    createdAt: "2026-04-10T00:00:00.000Z",
  },
  {
    handle: "ghk-cu-serum-control",
    title: "GHK-Cu Reference Standard",
    productType: "Research Compound",
    collections: ["research-compounds", "new-arrivals", "all-products"],
    tags: ["reference-standard", "analytical", "hplc-tested"],
    description:
      "A high-purity GHK-Cu reference standard prepared for analytical method development, calibration, and comparative laboratory study. Supplied with batch-specific analytical documentation. For laboratory research purposes only. Not for human or veterinary use.",
    specs: {
      form: "Lyophilized reference standard",
      storage: "Store at -20°C. Protect from light and moisture.",
    },
    variants: [
      { title: "25 mg", sku: "BL-GHKRS-25", price: "59.00" },
    ],
    createdAt: "2026-06-30T00:00:00.000Z",
  },
  {
    handle: "bacteriostatic-water",
    title: "Bacteriostatic Water (Research Grade)",
    productType: "Lab Essential",
    collections: ["lab-essentials", "all-products"],
    tags: ["diluent", "laboratory", "sterile"],
    description:
      "Sterile bacteriostatic water for laboratory reconstitution and dilution procedures in research settings. Supplied in sealed multi-dose vials. For laboratory research purposes only. Not for human or veterinary use.",
    specs: {
      form: "Sterile solution, 0.9% benzyl alcohol",
      storage: "Store at controlled room temperature (20–25°C).",
    },
    variants: [
      { title: "10 mL", sku: "BL-BW-10", price: "12.00" },
      { title: "30 mL", sku: "BL-BW-30", price: "24.00" },
    ],
    createdAt: "2026-01-12T00:00:00.000Z",
  },
  {
    handle: "empty-sterile-vials",
    title: "Sterile Research Vials (10-Pack)",
    productType: "Lab Essential",
    collections: ["lab-essentials", "all-products"],
    tags: ["consumables", "laboratory", "sterile"],
    description:
      "Type I borosilicate glass vials with sterile stoppers and crimp seals, supplied in packs of ten for laboratory sample preparation and storage. For laboratory research purposes only. Not for human or veterinary use.",
    specs: {
      form: "3 mL Type I borosilicate vials, sterile",
      storage: "Store in a clean, dry environment.",
    },
    variants: [
      { title: "10-pack", sku: "BL-VIAL-10", price: "18.00" },
    ],
    createdAt: "2026-02-01T00:00:00.000Z",
  },
];

function productImage(handle: string, title: string) {
  return {
    url: `/products/${handle}.svg`,
    altText: `${title} — research-grade lyophilized vial (illustration)`,
    width: 1200,
    height: 1200,
  };
}

export const mockProducts: CommerceProduct[] = seeds.map((seed) => {
  const variants = seed.variants.map((v, i) => ({
    id: `${seed.handle}-variant-${i + 1}`,
    title: v.title,
    sku: v.sku,
    availableForSale: true,
    price: money(v.price),
    compareAtPrice: null,
    selectedOptions: { Strength: v.title },
  }));

  const prices = variants.map((v) => parseFloat(v.price.amount));
  const min = Math.min(...prices).toFixed(2);
  const max = Math.max(...prices).toFixed(2);

  return {
    id: `prod_${seed.handle.replace(/-/g, "_")}`,
    handle: seed.handle,
    title: seed.title,
    description: seed.description,
    productType: seed.productType,
    tags: seed.tags,
    vendor: "Demo Commerce Provider",
    featuredImage: productImage(seed.handle, seed.title),
    images: [productImage(seed.handle, seed.title)],
    options: [
      {
        id: `${seed.handle}-opt-strength`,
        name: "Strength",
        values: seed.variants.map((v) => v.title),
      },
    ],
    variants,
    priceRange: {
      minVariantPrice: money(min),
      maxVariantPrice: money(max),
    },
    collections: seed.collections,
    specs: {
      sku: seed.variants[0]?.sku,
      sequence: seed.specs.sequence,
      molecularFormula: seed.specs.molecularFormula,
      molecularWeight: seed.specs.molecularWeight,
      form: seed.specs.form,
      storage: seed.specs.storage,
      purity: "Verified by independent third-party HPLC analysis",
      coa: null, // No COA files exist yet — the UI must not fabricate one.
      batchLot: "Assigned at fulfillment",
    },
    seo: {
      title: `${seed.title} — Research Use Only`,
      description: seed.description.slice(0, 155),
    },
    createdAt: seed.createdAt,
    updatedAt: seed.createdAt,
  };
});

/** Handles of products flagged as featured, for homepage merchandising. */
export const featuredProductHandles: string[] = seeds
  .filter((s) => s.featured)
  .map((s) => s.handle);
