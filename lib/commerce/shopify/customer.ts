import "server-only";

import { customerMetafieldMap, hasCompleteCustomerConsentMapping } from "./metafields";
import { CommerceError, type CustomerProfile, type CustomerRegistration } from "../types";

const apiVersion = process.env.SHOPIFY_API_VERSION ?? process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION ?? "2025-04";
const domain = process.env.SHOPIFY_STORE_DOMAIN ?? process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontToken = process.env.SHOPIFY_STOREFRONT_API_ACCESS_TOKEN ?? process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

async function storefrontRequest<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  if (!domain || !storefrontToken) throw new CommerceError("Account services are temporarily unavailable.", "configuration");
  const response = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, { method: "POST", headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": storefrontToken }, body: JSON.stringify({ query, variables }), cache: "no-store" }).catch(() => null);
  if (!response?.ok) throw new CommerceError("Account services are temporarily unavailable.");
  const body = await response.json() as { data?: T; errors?: { message: string }[] }; if (!body.data || body.errors?.length) throw new CommerceError("Account services are temporarily unavailable."); return body.data;
}

function customerError(errors: Array<{ message: string }> | undefined) { if (errors?.length) throw new CommerceError("We could not complete that request. Please check your information and try again.", "invalid"); }

async function writeRegistrationMetadata(customerId: string, registration: CustomerRegistration) {
  const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (!domain || !adminToken || !hasCompleteCustomerConsentMapping()) throw new CommerceError("Registration is awaiting secure customer record configuration. Please contact Cellova Labs support.", "configuration");
  const values = [
    ["company", registration.company, "single_line_text_field"], ["state", registration.state, "single_line_text_field"], ["intendedUse", registration.intendedUse, "single_line_text_field"],
    ["consentAccepted", "true", "boolean"], ["consentVersion", registration.consentVersion, "single_line_text_field"], ["consentTimestamp", new Date().toISOString(), "date_time"],
  ] as const;
  const metafields = values.map(([mapKey, value, type]) => { const field = customerMetafieldMap[mapKey]; if (!field) throw new CommerceError("Registration is awaiting secure customer record configuration.", "configuration"); return { ownerId: customerId, namespace: field.namespace, key: field.key, value, type }; });
  const response = await fetch(`https://${domain}/admin/api/${apiVersion}/graphql.json`, { method: "POST", headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": adminToken }, body: JSON.stringify({ query: "mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) { metafieldsSet(metafields: $metafields) { userErrors { message } } }", variables: { metafields } }), cache: "no-store" }).catch(() => null);
  if (!response?.ok) throw new CommerceError("We could not securely save the registration details. Please try again later.");
  const body = await response.json() as { data?: { metafieldsSet?: { userErrors?: { message: string }[] } } }; customerError(body.data?.metafieldsSet?.userErrors);
}

export async function registerCustomer(registration: CustomerRegistration) {
  if (!registration.consentAccepted || !registration.consentVersion) throw new CommerceError("Consent is required to register.", "invalid");
  if (!domain || !process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || !hasCompleteCustomerConsentMapping()) throw new CommerceError("Registration is awaiting secure customer record configuration. Please contact Cellova Labs support.", "configuration");
  const data = await storefrontRequest<{ customerCreate: { customer: { id: string } | null; customerUserErrors: { message: string }[] } }>("mutation CustomerCreate($input: CustomerCreateInput!) { customerCreate(input: $input) { customer { id } customerUserErrors { message } } }", { input: { firstName: registration.firstName, lastName: registration.lastName, email: registration.email, phone: registration.phone || undefined, password: registration.password } });
  customerError(data.customerCreate.customerUserErrors); if (!data.customerCreate.customer) throw new CommerceError("We could not create your customer record. Please try again.");
  await writeRegistrationMetadata(data.customerCreate.customer.id, registration);
  return signInCustomer(registration.email, registration.password);
}

export async function signInCustomer(email: string, password: string) {
  const data = await storefrontRequest<{ customerAccessTokenCreate: { customerAccessToken: { accessToken: string; expiresAt: string } | null; customerUserErrors: { message: string }[] } }>("mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) { customerAccessTokenCreate(input: $input) { customerAccessToken { accessToken expiresAt } customerUserErrors { message } } }", { input: { email, password } });
  customerError(data.customerAccessTokenCreate.customerUserErrors); const session = data.customerAccessTokenCreate.customerAccessToken; if (!session) throw new CommerceError("We could not sign you in. Please try again."); return session;
}

export async function getCurrentCustomer(accessToken: string): Promise<CustomerProfile | null> {
  const data = await storefrontRequest<{ customer: CustomerProfile | null }>("query Customer($accessToken: String!) { customer(customerAccessToken: $accessToken) { id firstName lastName email phone } }", { accessToken }); return data.customer;
}

export async function signOutCustomer(accessToken: string) { await storefrontRequest("mutation CustomerAccessTokenDelete($accessToken: String!) { customerAccessTokenDelete(customerAccessToken: $accessToken) { deletedAccessToken } }", { accessToken }).catch(() => undefined); }
