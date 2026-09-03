import type { CommerceCollection } from "@/lib/commerce/types";

/**
 * TEMPORARY demo collections. Replace by connecting a live provider
 * (COMMERCE_PROVIDER=medusa | shopify) and removing lib/mock-data/.
 */
export const mockCollections: CommerceCollection[] = [
  {
    id: "col_all_products",
    handle: "all-products",
    title: "All Products",
    description:
      "Development demonstration catalog: peptides, blends, reference compounds, and laboratory essentials. Configure Shopify or Medusa to display the live Cellova catalog.",
    image: {
      url: "/collections/all-products.svg",
      altText: "Development demonstration research catalog",
      width: 1600,
      height: 900,
    },
    seo: {
      title: "All Research Products",
      description:
        "Browse a development demonstration catalog. Configure the active commerce provider for live product records.",
    },
  },
  {
    id: "col_research_peptides",
    handle: "research-peptides",
    title: "Research Peptides",
    description:
      "Single-analyte synthetic research peptides, lyophilized for stability and verified by independent third-party analytical testing. For laboratory research purposes only.",
    image: {
      url: "/collections/research-peptides.svg",
      altText: "Research peptides collection",
      width: 1600,
      height: 900,
    },
    seo: {
      title: "Research Peptides",
      description:
        "Lyophilized research peptides with third-party identity and purity verification. Research use only.",
    },
  },
  {
    id: "col_peptide_blends",
    handle: "peptide-blends",
    title: "Peptide Blends",
    description:
      "Co-lyophilized multi-analyte peptide blends prepared for laboratory studies requiring combined research materials in a single vial.",
    image: {
      url: "/collections/peptide-blends.svg",
      altText: "Peptide blends collection",
      width: 1600,
      height: 900,
    },
    seo: {
      title: "Peptide Blends",
      description:
        "Co-lyophilized research peptide blends with batch-specific analytical verification. Research use only.",
    },
  },
  {
    id: "col_research_compounds",
    handle: "research-compounds",
    title: "Research Compounds",
    description:
      "Reference standards and specialty research compounds for analytical method development, calibration, and comparative laboratory study.",
    image: {
      url: "/collections/research-compounds.svg",
      altText: "Research compounds collection",
      width: 1600,
      height: 900,
    },
    seo: {
      title: "Research Compounds",
      description:
        "Reference standards and specialty compounds for analytical research. Research use only.",
    },
  },
  {
    id: "col_lab_essentials",
    handle: "lab-essentials",
    title: "Lab Essentials",
    description:
      "Research-grade consumables and diluents supporting laboratory preparation, reconstitution, and sample storage workflows.",
    image: {
      url: "/collections/lab-essentials.svg",
      altText: "Lab essentials collection",
      width: 1600,
      height: 900,
    },
    seo: {
      title: "Lab Essentials",
      description:
        "Research-grade diluents, vials, and laboratory consumables. Research use only.",
    },
  },
  {
    id: "col_new_arrivals",
    handle: "new-arrivals",
    title: "New Arrivals",
    description:
      "Recently added records in the development demonstration catalog, used only when a live commerce provider is not configured.",
    image: {
      url: "/collections/new-arrivals.svg",
      altText: "New arrivals collection",
      width: 1600,
      height: 900,
    },
    seo: {
      title: "New Arrivals",
      description:
        "Latest development demonstration records. Configure a live commerce provider for production catalog data.",
    },
  },
  {
    id: "col_popular_research_products",
    handle: "popular-research-products",
    title: "Popular Research Products",
    description:
      "A development-only collection used to exercise the storefront before a live commerce provider is configured.",
    image: {
      url: "/collections/popular-research-products.svg",
      altText: "Popular research products collection",
      width: 1600,
      height: 900,
    },
    seo: {
      title: "Popular Research Products",
      description:
        "Frequently requested research peptides and materials. Research use only.",
    },
  },
];
