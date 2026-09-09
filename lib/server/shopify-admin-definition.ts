type ShopifyGraphQLError = {
  message?: string;
};

type ShopifyGraphQLResponse<T> = {
  data?: T;
  errors?: ShopifyGraphQLError[];
};

type AdminTokenResponse = {
  access_token?: string;
};

type ShopifyDefinitionField = {
  key?: string;
  name?: string;
  type?: { name?: string };
};

type ShopifyDefinitionResponse = {
  metaobjectDefinitionByType?: {
    type?: string;
    fieldDefinitions?: ShopifyDefinitionField[];
  } | null;
};

export type PublicDefinitionField = {
  key: string;
  name: string;
  type: string;
};

export type PublicDefinition = {
  type: string;
  fields: PublicDefinitionField[];
};

export class ShopifyDefinitionVerificationError extends Error {
  readonly name = "ShopifyDefinitionVerificationError";
}

function normalizeAdminShop(rawShop: string | undefined): string {
  const shop = rawShop?.trim().replace(/^https?:\/\//i, "").replace(/\/+$/, "");

  if (!shop || !/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(shop)) {
    throw new ShopifyDefinitionVerificationError("Shopify Admin verification is unavailable.");
  }

  return shop.toLowerCase();
}

function requireAdminCredentials(): {
  clientId: string;
  clientSecret: string;
  shop: string;
} {
  const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID?.trim();
  const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET?.trim();
  const shop = normalizeAdminShop(process.env.SHOPIFY_ADMIN_SHOP);

  if (!clientId || !clientSecret) {
    throw new ShopifyDefinitionVerificationError("Shopify Admin verification is unavailable.");
  }

  return { clientId, clientSecret, shop };
}

async function getAdminAccessToken(credentials: {
  clientId: string;
  clientSecret: string;
  shop: string;
}): Promise<string> {
  let response: Response;

  try {
    response = await fetch(`https://${credentials.shop}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
      }),
      cache: "no-store",
    });
  } catch {
    throw new ShopifyDefinitionVerificationError("Shopify Admin verification is unavailable.");
  }

  const payload = (await response.json().catch(() => null)) as AdminTokenResponse | null;
  const accessToken = payload?.access_token?.trim();

  if (!response.ok || !accessToken) {
    throw new ShopifyDefinitionVerificationError("Shopify Admin verification is unavailable.");
  }

  return accessToken;
}

function isPublicDefinitionField(
  field: ShopifyDefinitionField
): field is ShopifyDefinitionField & { key: string; name: string; type: { name: string } } {
  return Boolean(field.key?.trim() && field.name?.trim() && field.type?.name?.trim());
}

/**
 * Temporary read-only verification helper. It deliberately returns only the
 * configured definition type and field metadata, never credentials, tokens,
 * customers, metaobject entries, products, orders, or GraphQL error details.
 */
export async function fetchCustomerRegistrationDefinition(): Promise<PublicDefinition> {
  const credentials = requireAdminCredentials();
  const accessToken = await getAdminAccessToken(credentials);
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
    throw new ShopifyDefinitionVerificationError("Shopify Admin verification is unavailable.");
  }

  const payload = (await response.json().catch(() => null)) as ShopifyGraphQLResponse<ShopifyDefinitionResponse> | null;
  const definition = payload?.data?.metaobjectDefinitionByType;

  if (!response.ok || payload?.errors?.length || !definition?.type || !definition.fieldDefinitions) {
    throw new ShopifyDefinitionVerificationError("Shopify Admin verification is unavailable.");
  }

  const fields = definition.fieldDefinitions.filter(isPublicDefinitionField).map((field) => ({
    key: field.key.trim(),
    name: field.name.trim(),
    type: field.type.name.trim(),
  }));

  if (!fields.length) {
    throw new ShopifyDefinitionVerificationError("Shopify Admin verification is unavailable.");
  }

  return { type: definition.type.trim(), fields };
}
