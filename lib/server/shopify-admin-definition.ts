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
  errors?: Array<{ message?: string; extensions?: { code?: string } }>;
};

export type CustomerRegistrationDefinition = {
  type: string;
  fields: Array<{ name: string; key: string; type: string }>;
};

export type ShopifyDefinitionVerificationFailure =
  | "credentials"
  | "token_request"
  | "token_grant"
  | "shop_not_permitted"
  | "graphql_error"
  | "definition_unavailable";

export class ShopifyDefinitionVerificationError extends Error {
  constructor(public readonly code: ShopifyDefinitionVerificationFailure) {
    super("Shopify Admin definition verification is unavailable.");
  }
}

function verificationError(code: ShopifyDefinitionVerificationFailure): ShopifyDefinitionVerificationError {
  return new ShopifyDefinitionVerificationError(code);
}

function getCredentials(): AdminCredentials {
  const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID?.trim();
  const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET?.trim();
  const configuredShop = process.env.SHOPIFY_ADMIN_SHOP?.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const shop = configuredShop && !configuredShop.includes(".") ? `${configuredShop}.myshopify.com` : configuredShop;

  if (!clientId || !clientSecret || !shop) {
    throw verificationError("credentials");
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
    throw verificationError("token_request");
  }

  const payload = (await response.json().catch(() => null)) as { access_token?: unknown } | null;
  const accessToken = typeof payload?.access_token === "string" ? payload.access_token.trim() : "";

  if (response.status === 403) {
    throw verificationError("shop_not_permitted");
  }

  if (!response.ok || !accessToken) {
    throw verificationError("token_grant");
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
    throw verificationError("graphql_error");
  }

  const payload = (await response.json().catch(() => null)) as ShopifyGraphQLResponse | null;
  const definition = payload?.data?.metaobjectDefinitionByType;

  if (!response.ok || payload?.errors?.length) {
    throw verificationError(response.status === 403 ? "shop_not_permitted" : "graphql_error");
  }

  if (!definition?.type || !definition.fieldDefinitions) {
    throw verificationError("definition_unavailable");
  }

  const fields = definition.fieldDefinitions.filter(isPublicField).map((field) => ({
    name: field.name.trim(),
    key: field.key.trim(),
    type: field.type.name.trim(),
  }));

  if (!fields.length) {
    throw verificationError("definition_unavailable");
  }

  return { type: definition.type.trim(), fields };
}
