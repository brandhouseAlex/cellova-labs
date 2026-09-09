import { createHash } from "node:crypto";
import { adminGraphql, ShopifyAdminError, throwOnUserErrors } from "@/lib/server/shopify-admin";

const REGISTRATION_NAME = "Customer Registration";
const REGISTRATION_REFERENCE = { namespace: "custom", key: "customer_registration", type: "metaobject_reference" } as const;

export const INELIGIBLE_MESSAGE = "No completed account was found for this email. Please create an account first.";

export interface RegistrationInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  acceptsResearchUseTerms: boolean;
}

export type NormalizedRegistrationInput = RegistrationInput;

interface RegistrationFieldDefinition {
  key: string;
  name: string;
  type: { name: string };
}

interface MetaobjectDefinitionsQuery {
  metaobjectDefinitions: {
    edges: Array<{ cursor: string; node: { name: string; type: string; fieldDefinitions: RegistrationFieldDefinition[] } }>;
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
}

export interface RegistrationSchema {
  type: string;
  fields: {
    businessName: RegistrationFieldDefinition;
    ageAndResearchConsent: RegistrationFieldDefinition;
    registrationDate: RegistrationFieldDefinition;
    registrationComplete: RegistrationFieldDefinition;
  };
}

interface AdminRegistrationMetaobject {
  id: string;
  type: string;
  handle?: string;
  fields: Array<{ key: string; value: string | null }>;
}

interface AdminCustomer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  createdAt: string;
  registration: { reference?: AdminRegistrationMetaobject | null } | null;
}

export interface EligibleCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  createdAt: string;
}

function normaliseText(value: string, label: string, limit: number): string {
  const normalised = value.trim().replace(/\s+/g, " ");
  if (!normalised || normalised.length > limit) throw new Error(`Invalid ${label}`);
  return normalised;
}

export function normaliseRegistrationInput(input: RegistrationInput): NormalizedRegistrationInput {
  const email = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) throw new Error("Invalid email address");
  const digits = input.phone.replace(/[^\d+]/g, "");
  const phone = digits.startsWith("+") ? digits : digits.length === 10 ? `+1${digits}` : `+${digits}`;
  if (!/^\+[1-9]\d{6,14}$/.test(phone)) throw new Error("Invalid phone number");
  if (!input.acceptsResearchUseTerms) throw new Error("Research-use consent is required");
  return {
    firstName: normaliseText(input.firstName, "first name", 80),
    lastName: normaliseText(input.lastName, "last name", 80),
    companyName: normaliseText(input.companyName, "company name", 160),
    email,
    phone,
    acceptsResearchUseTerms: true,
  };
}

function comparisonLabel(value: string): string {
  return value.toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/g, "");
}

function selectField(fields: RegistrationFieldDefinition[], name: string): RegistrationFieldDefinition {
  const target = comparisonLabel(name);
  const field = fields.find((candidate) => comparisonLabel(candidate.name) === target);
  if (!field?.key || !field.type?.name) throw new ShopifyAdminError("graphql", "Customer Registration definition is incomplete");
  return field;
}

export async function discoverRegistrationSchema(): Promise<RegistrationSchema> {
  let after: string | null = null;
  for (let page = 0; page < 20; page += 1) {
    const result: MetaobjectDefinitionsQuery = await adminGraphql<MetaobjectDefinitionsQuery>(
      `query FindCustomerRegistrationDefinition($after: String) {
        metaobjectDefinitions(first: 50, after: $after) {
          edges { cursor node { name type fieldDefinitions { key name type { name } } } }
          pageInfo { hasNextPage endCursor }
        }
      }`,
      { after }
    );
    const definition = result.metaobjectDefinitions.edges.map((edge) => edge.node).find((node) => comparisonLabel(node.name) === comparisonLabel(REGISTRATION_NAME));
    if (definition) {
      return {
        type: definition.type,
        fields: {
          businessName: selectField(definition.fieldDefinitions, "Business Name"),
          ageAndResearchConsent: selectField(definition.fieldDefinitions, "Age & Research Consent"),
          registrationDate: selectField(definition.fieldDefinitions, "Registration Date & Time"),
          registrationComplete: selectField(definition.fieldDefinitions, "Registration Complete"),
        },
      };
    }
    if (!result.metaobjectDefinitions.pageInfo.hasNextPage) break;
    after = result.metaobjectDefinitions.pageInfo.endCursor;
  }
  throw new ShopifyAdminError("graphql", "Customer Registration definition was not found");
}

function quotedEmailSearch(email: string): string {
  return `email:"${email.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}"`;
}

function customerSelection() {
  return `id email firstName lastName phone createdAt
    registration: metafield(namespace: "${REGISTRATION_REFERENCE.namespace}", key: "${REGISTRATION_REFERENCE.key}") {
      reference { ... on Metaobject { id type handle fields { key value } } }
    }`;
}

async function findCustomerByEmail(email: string): Promise<AdminCustomer | null> {
  const result = await adminGraphql<{ customers: { edges: Array<{ node: AdminCustomer }> } }>(
    `query FindCustomer($query: String!) { customers(first: 2, query: $query) { edges { node { ${customerSelection()} } } } }`,
    { query: quotedEmailSearch(email) }
  );
  return result.customers.edges.map((edge) => edge.node).find((customer) => customer.email.trim().toLowerCase() === email) ?? null;
}

async function findCustomerById(id: string): Promise<AdminCustomer | null> {
  const result = await adminGraphql<{ node: AdminCustomer | null }>(
    `query FindCustomerById($id: ID!) { node(id: $id) { ... on Customer { ${customerSelection()} } } }`,
    { id }
  );
  return result.node;
}

async function updateCustomer(customer: AdminCustomer, input: NormalizedRegistrationInput): Promise<AdminCustomer> {
  const result = await adminGraphql<{ customerUpdate: { customer: AdminCustomer | null; userErrors: Array<{ message?: string }> } }>(
    `mutation UpdateCustomer($input: CustomerInput!) { customerUpdate(input: $input) { customer { ${customerSelection()} } userErrors { message } } }`,
    { input: { id: customer.id, firstName: input.firstName, lastName: input.lastName, email: input.email, phone: input.phone } }
  );
  throwOnUserErrors(result.customerUpdate.userErrors, "customer_update");
  if (!result.customerUpdate.customer) throw new ShopifyAdminError("graphql", "Customer update did not return a customer");
  return result.customerUpdate.customer;
}

async function createCustomer(input: NormalizedRegistrationInput): Promise<AdminCustomer> {
  const result = await adminGraphql<{ customerCreate: { customer: AdminCustomer | null; userErrors: Array<{ message?: string }> } }>(
    `mutation CreateCustomer($input: CustomerInput!) { customerCreate(input: $input) { customer { ${customerSelection()} } userErrors { message } } }`,
    { input: { firstName: input.firstName, lastName: input.lastName, email: input.email, phone: input.phone } }
  );
  throwOnUserErrors(result.customerCreate.userErrors, "customer_create");
  if (!result.customerCreate.customer) throw new ShopifyAdminError("graphql", "Customer creation did not return a customer");
  return result.customerCreate.customer;
}

function registrationHandle(email: string): string {
  return `cellova-${createHash("sha256").update(email).digest("hex").slice(0, 24)}`;
}

async function findMetaobjectByHandle(type: string, handle: string): Promise<AdminRegistrationMetaobject | null> {
  const result = await adminGraphql<{ metaobjectByHandle: AdminRegistrationMetaobject | null }>(
    `query RegistrationByHandle($handle: MetaobjectHandleInput!) { metaobjectByHandle(handle: $handle) { id type handle fields { key value } } }`,
    { handle: { type, handle } }
  );
  return result.metaobjectByHandle;
}

function fieldValues(schema: RegistrationSchema, input: NormalizedRegistrationInput, complete: boolean) {
  return {
    [schema.fields.businessName.key]: input.companyName,
    [schema.fields.ageAndResearchConsent.key]: "true",
    [schema.fields.registrationDate.key]: new Date().toISOString(),
    [schema.fields.registrationComplete.key]: complete ? "true" : "false",
  };
}

async function createRegistrationMetaobject(schema: RegistrationSchema, input: NormalizedRegistrationInput): Promise<AdminRegistrationMetaobject> {
  const result = await adminGraphql<{ metaobjectCreate: { metaobject: AdminRegistrationMetaobject | null; userErrors: Array<{ message?: string }> } }>(
    `mutation CreateRegistration($metaobject: MetaobjectCreateInput!) { metaobjectCreate(metaobject: $metaobject) { metaobject { id type handle fields { key value } } userErrors { message } } }`,
    { metaobject: { type: schema.type, handle: registrationHandle(input.email), values: fieldValues(schema, input, false) } }
  );
  throwOnUserErrors(result.metaobjectCreate.userErrors, "registration_create");
  if (!result.metaobjectCreate.metaobject) throw new ShopifyAdminError("graphql", "Registration creation did not return a metaobject");
  return result.metaobjectCreate.metaobject;
}

async function updateRegistrationMetaobject(id: string, schema: RegistrationSchema, input: NormalizedRegistrationInput, complete: boolean): Promise<AdminRegistrationMetaobject> {
  const result = await adminGraphql<{ metaobjectUpdate: { metaobject: AdminRegistrationMetaobject | null; userErrors: Array<{ message?: string }> } }>(
    `mutation UpdateRegistration($id: ID!, $metaobject: MetaobjectUpdateInput!) { metaobjectUpdate(id: $id, metaobject: $metaobject) { metaobject { id type handle fields { key value } } userErrors { message } } }`,
    { id, metaobject: { fields: Object.entries(fieldValues(schema, input, complete)).map(([key, value]) => ({ key, value })) } }
  );
  throwOnUserErrors(result.metaobjectUpdate.userErrors, "registration_update");
  if (!result.metaobjectUpdate.metaobject) throw new ShopifyAdminError("graphql", "Registration update did not return a metaobject");
  return result.metaobjectUpdate.metaobject;
}

async function attachRegistrationReference(customerId: string, registrationId: string): Promise<void> {
  const result = await adminGraphql<{ metafieldsSet: { userErrors: Array<{ message?: string }> } }>(
    `mutation AttachRegistration($metafields: [MetafieldsSetInput!]!) { metafieldsSet(metafields: $metafields) { userErrors { message } } }`,
    { metafields: [{ ownerId: customerId, namespace: REGISTRATION_REFERENCE.namespace, key: REGISTRATION_REFERENCE.key, type: REGISTRATION_REFERENCE.type, value: registrationId }] }
  );
  throwOnUserErrors(result.metafieldsSet.userErrors, "reference_attach");
}

function isComplete(customer: AdminCustomer, schema: RegistrationSchema): boolean {
  const registration = customer.registration?.reference;
  if (!registration || registration.type !== schema.type) return false;
  return registration.fields.some((field) => field.key === schema.fields.registrationComplete.key && field.value === "true");
}

function eligibleCustomer(customer: AdminCustomer): EligibleCustomer {
  return {
    id: customer.id,
    email: customer.email,
    firstName: customer.firstName ?? "",
    lastName: customer.lastName ?? "",
    phone: customer.phone,
    createdAt: customer.createdAt,
  };
}

export async function findEligibleCustomerByEmail(rawEmail: string): Promise<EligibleCustomer | null> {
  const email = rawEmail.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  const [schema, customer] = await Promise.all([discoverRegistrationSchema(), findCustomerByEmail(email)]);
  return customer && isComplete(customer, schema) ? eligibleCustomer(customer) : null;
}

export async function findEligibleCustomerById(customerId: string, expectedEmail?: string): Promise<EligibleCustomer | null> {
  const [schema, customer] = await Promise.all([discoverRegistrationSchema(), findCustomerById(customerId)]);
  if (!customer || (expectedEmail && customer.email.trim().toLowerCase() !== expectedEmail.trim().toLowerCase()) || !isComplete(customer, schema)) return null;
  return eligibleCustomer(customer);
}

export async function registerCustomer(rawInput: RegistrationInput): Promise<EligibleCustomer> {
  const input = normaliseRegistrationInput(rawInput);
  const schema = await discoverRegistrationSchema();
  let customer = await findCustomerByEmail(input.email);
  if (customer) {
    customer = await updateCustomer(customer, input);
  } else {
    try {
      customer = await createCustomer(input);
    } catch (error) {
      if (!(error instanceof ShopifyAdminError)) throw error;
      customer = await findCustomerByEmail(input.email);
      if (!customer) throw error;
      customer = await updateCustomer(customer, input);
    }
  }

  const referenced = customer.registration?.reference;
  let registration = referenced && referenced.type === schema.type ? referenced : await findMetaobjectByHandle(schema.type, registrationHandle(input.email));
  if (registration) {
    registration = await updateRegistrationMetaobject(registration.id, schema, input, false);
  } else {
    try {
      registration = await createRegistrationMetaobject(schema, input);
    } catch (error) {
      if (!(error instanceof ShopifyAdminError)) throw error;
      registration = await findMetaobjectByHandle(schema.type, registrationHandle(input.email));
      if (!registration) throw error;
      registration = await updateRegistrationMetaobject(registration.id, schema, input, false);
    }
  }

  await attachRegistrationReference(customer.id, registration.id);
  await updateRegistrationMetaobject(registration.id, schema, input, true);
  const verified = await findEligibleCustomerById(customer.id, input.email);
  if (!verified) throw new ShopifyAdminError("graphql", "Registration completion could not be verified");
  return verified;
}
