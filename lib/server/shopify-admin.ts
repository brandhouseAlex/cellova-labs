import { ADMIN_API_VERSION, adminCredentials, adminShopHost } from "@/lib/server/access-config";

export class ShopifyAdminError extends Error {
  constructor(
    public readonly category: "configuration" | "token" | "transport" | "graphql" | "user",
    message: string,
    public readonly operation: "unknown" | "customer_create" | "customer_update" | "registration_create" | "registration_update" | "reference_attach" = "unknown",
    public readonly userErrorCode: "invalid" | "taken" | "not_permitted" | "other" = "other",
  ) {
    super(message);
    this.name = "ShopifyAdminError";
  }
}

interface GraphqlResponse<T> {
  data?: T;
  errors?: Array<{ message?: string }>;
}

export async function getAdminAccessToken(): Promise<string> {
  const { clientId, clientSecret } = adminCredentials();
  const response = await fetch(`https://${adminShopHost()}/admin/oauth/access_token`, {
    method: "POST",
    cache: "no-store",
    headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) throw new ShopifyAdminError("token", "Shopify Admin token request failed");
  const payload = (await response.json()) as { access_token?: unknown };
  if (typeof payload.access_token !== "string" || !payload.access_token) {
    throw new ShopifyAdminError("token", "Shopify Admin token response was invalid");
  }
  return payload.access_token;
}

export async function adminGraphql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const token = await getAdminAccessToken();
  let response: Response;
  try {
    response = await fetch(`https://${adminShopHost()}/admin/api/${ADMIN_API_VERSION}/graphql.json`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    });
  } catch {
    throw new ShopifyAdminError("transport", "Shopify Admin request could not be completed");
  }

  if (!response.ok) throw new ShopifyAdminError("transport", "Shopify Admin request failed");
  const payload = (await response.json()) as GraphqlResponse<T>;
  if (payload.errors?.length || !payload.data) throw new ShopifyAdminError("graphql", "Shopify Admin GraphQL request failed");
  return payload.data;
}

export function throwOnUserErrors(
  errors: Array<{ message?: string; code?: unknown }> | undefined,
  operation: ShopifyAdminError["operation"] = "unknown",
): void {
  if (!errors?.length) return;
  const codes = new Set(errors.map((error) => String(error.code ?? "").toUpperCase()));
  const userErrorCode = codes.has("INVALID") || codes.has("BLANK") || codes.has("TOO_LONG")
    ? "invalid"
    : codes.has("TAKEN") || codes.has("ALREADY_EXISTS")
      ? "taken"
      : codes.has("NOT_PERMITTED") || codes.has("ACCESS_DENIED") || codes.has("FORBIDDEN")
        ? "not_permitted"
        : "other";
  throw new ShopifyAdminError("user", "Shopify rejected the requested registration update", operation, userErrorCode);
}
