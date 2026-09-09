type AdminCredentials = {
  clientId: string;
  clientSecret: string;
  shop: string;
};

type ShopifyDefinitionField = {
  key?: string | null;
  name?: string | null;
  type?: { name?: string | null } | null;
};

type ShopifyGraphQLResponse = {
  data?: {
    metaobjectDefinitionByType?: {
      type?: string | null;
      fieldDefinitions?: ShopifyDefinitionField[] | null;
    } | null;
  } | null;
  errors?: Array<{ message?: string }>;
};

export type CustomerRegistrationDefinition = {
  type: string;
  fields: Array<{ name: string; key: string; type: string }>;
};

export class ShopifyDefinitionVerificationError extends Error {
  constructor() {
    super("Shopify Admin verification is unavailable.");
  }
}

function getCredentials(): AdminCredentials {
  const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID?.trim();
  const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET?.trim();
  const configuredShop = process.env.SHOPIFY_ADMIN_SHOP?.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const shop = configuredShop && !configuredShop.includes(".") ? `${configuredShop}.myshopify.com` : configuredShop;

  if (!clientId || !clientSecret || !shop) {
    throw new ShopifyDefinitionVerificationError();
  }

  return { clientId, clientSecret, shop };
}

async function getAccessToken(credentials: AdminCredentials): Promise<string> {
  let response: Response;

  try {
    response = await fetch(`https://${credentials.shop}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        grant_type: "client_credentials",
      }),
      cache: "no-store",
    });
  } catch {
    throw new ShopifyDefinitionVerificationError();
  }

  const payload = (await response.json().catch(() => null)) as { access_token?: unknown } | null;
  const accessToken = typeof payload?.access_token === "string" ? payload.access_token.trim() : "";

  if (!response.ok || !accessToken) {
    throw new ShopifyDefinitionVerificationError();
  }

  return accessToken;
}

function isPublicField(
  field: ShopifyDefinitionField
): field is ShopifyDefinitionField & { key: string; name: string; type: { name: string } } {
  return Boolean(field.key?.trim() && field.name?.trim() && field.type?.name?.trim());
}

/**
 * Temporary read-only helper. It makes no mutations and returns only the
 * metaobject definition type plus field display names, exact keys, and types.
 */
export async function fetchCustomerRegistrationDefinition(): Promise<CustomerRegistrationDefinition> {
  const credentials = getCredentials();
  const accessToken = await getAccessToken(credentials);
  let response: Response;

  try {
    response = await fetch(`https://${credentials.shop}/admin/api/2026-07/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({
        query: `query CustomerRegistrationDefinition($type: String!) {
          metaobjectDefinitionByType(type: $type) {
            type
            fieldDefinitions {
              key
              name
              type { name }
            }
          }
        }`,
        variables: { type: "customer_registration" },
      }),
      cache: "no-store",
    });
  } catch {
    throw new ShopifyDefinitionVerificationError();
  }

  const payload = (await response.json().catch(() => null)) as ShopifyGraphQLResponse | null;
  const definition = payload?.data?.metaobjectDefinitionByType;

  if (!response.ok || payload?.errors?.length || !definition?.type || !definition.fieldDefinitions) {
    throw new ShopifyDefinitionVerificationError();
  }

  const fields = definition.fieldDefinitions.filter(isPublicField).map((field) => ({
    name: field.name.trim(),
    key: field.key.trim(),
    type: field.type.name.trim(),
  }));

  if (!fields.length) {
    throw new ShopifyDefinitionVerificationError();
  }

  return { type: definition.type.trim(), fields };
}
