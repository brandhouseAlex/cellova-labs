type ProductMetafieldKey =
  | "productName" | "lotNumber" | "testedDate" | "laboratory" | "identity" | "purity"
  | "netContent" | "endotoxin" | "heavyMetals" | "pdfUrl" | "storageInstructions" | "intendedUse" | "coaMetaobjectReference";

type CustomerMetafieldKey = "company" | "state" | "intendedUse" | "consentAccepted" | "consentVersion" | "consentTimestamp";

export type MetafieldIdentifier = { namespace: string; key: string };

const namespace = process.env.CELLOVA_SHOPIFY_METAFIELD_NAMESPACE?.trim() ?? "";

function field(key?: string): MetafieldIdentifier | null {
  const cleanKey = key?.trim();
  return namespace && cleanKey ? { namespace, key: cleanKey } : null;
}

export const productMetafieldMap: Record<ProductMetafieldKey, MetafieldIdentifier | null> = {
  productName: field(process.env.CELLOVA_COA_PRODUCT_NAME_KEY),
  lotNumber: field(process.env.CELLOVA_COA_LOT_NUMBER_KEY),
  testedDate: field(process.env.CELLOVA_COA_TESTED_DATE_KEY),
  laboratory: field(process.env.CELLOVA_COA_LABORATORY_KEY),
  identity: field(process.env.CELLOVA_COA_IDENTITY_KEY),
  purity: field(process.env.CELLOVA_COA_PURITY_KEY),
  netContent: field(process.env.CELLOVA_COA_NET_CONTENT_KEY),
  endotoxin: field(process.env.CELLOVA_COA_ENDOTOXIN_KEY),
  heavyMetals: field(process.env.CELLOVA_COA_HEAVY_METALS_KEY),
  pdfUrl: field(process.env.CELLOVA_COA_PDF_KEY),
  coaMetaobjectReference: field(process.env.CELLOVA_COA_METAOBJECT_REFERENCE_KEY),
  storageInstructions: field(process.env.CELLOVA_STORAGE_INSTRUCTIONS_KEY),
  intendedUse: field(process.env.CELLOVA_INTENDED_USE_KEY),
};

export const customerMetafieldMap: Record<CustomerMetafieldKey, MetafieldIdentifier | null> = {
  company: field(process.env.CELLOVA_CUSTOMER_COMPANY_KEY),
  state: field(process.env.CELLOVA_CUSTOMER_STATE_KEY),
  intendedUse: field(process.env.CELLOVA_CUSTOMER_INTENDED_USE_KEY),
  consentAccepted: field(process.env.CELLOVA_CUSTOMER_CONSENT_ACCEPTED_KEY),
  consentVersion: field(process.env.CELLOVA_CUSTOMER_CONSENT_VERSION_KEY),
  consentTimestamp: field(process.env.CELLOVA_CUSTOMER_CONSENT_TIMESTAMP_KEY),
};

export function configuredProductMetafields() { return Object.values(productMetafieldMap).filter((item): item is MetafieldIdentifier => item !== null); }
export function hasCompleteCustomerConsentMapping() { return Object.values(customerMetafieldMap).every(Boolean); }
export const configuredCoaMetaobjectType = process.env.CELLOVA_COA_METAOBJECT_TYPE?.trim() || undefined;
