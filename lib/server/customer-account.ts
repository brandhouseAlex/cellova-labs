import { createRemoteJWKSet, jwtVerify } from "jose";
import {
  canonicalOrigin,
  customerAccountCallbackUrl,
  customerAccountClientId,
  customerAccountLogoutUrl as configuredLogoutUrl,
  sanitiseReturnPath,
  storefrontHost,
} from "@/lib/server/access-config";
import {
  COOKIE_MAX_AGE,
  type CellovaSessionCookie,
  type OAuthTransactionCookie,
  sealCookie,
} from "@/lib/server/secure-cookie";
import { findEligibleCustomerByEmail, findEligibleCustomerById, type EligibleCustomer } from "@/lib/server/registration-service";

interface OpenIdConfiguration {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint: string;
  jwks_uri: string;
  issuer: string;
}

interface CustomerApiConfiguration {
  graphql_api: string;
}

export class CustomerAccountError extends Error {
  constructor(public readonly code: "configuration" | "oauth" | "identity" | "ineligible", message: string) {
    super(message);
    this.name = "CustomerAccountError";
  }
}

function randomBase64Url(byteLength = 32): string {
  const data = new Uint8Array(byteLength);
  crypto.getRandomValues(data);
  return Buffer.from(data).toString("base64url");
}

async function sha256Base64Url(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Buffer.from(digest).toString("base64url");
}

async function discovery<T>(path: string): Promise<T> {
  const response = await fetch(`https://${storefrontHost()}${path}`, { cache: "no-store", headers: { accept: "application/json" } });
  if (!response.ok) throw new CustomerAccountError("configuration", "Shopify Customer Account discovery failed");
  return response.json() as Promise<T>;
}

export async function getOpenIdConfiguration(): Promise<OpenIdConfiguration> {
  const config = await discovery<OpenIdConfiguration>("/.well-known/openid-configuration");
  if (!config.authorization_endpoint || !config.token_endpoint || !config.end_session_endpoint || !config.jwks_uri || !config.issuer) {
    throw new CustomerAccountError("configuration", "Shopify Customer Account discovery is incomplete");
  }
  return config;
}

async function getCustomerApiConfiguration(): Promise<CustomerApiConfiguration> {
  const config = await discovery<CustomerApiConfiguration>("/.well-known/customer-account-api");
  if (!config.graphql_api) throw new CustomerAccountError("configuration", "Shopify Customer Account API discovery is incomplete");
  return config;
}

export interface OAuthStart {
  authorizationUrl: string;
  transactionCookie: string;
}

export async function startCustomerAccountAuthorization(email: string, returnTo?: string | null): Promise<OAuthStart> {
  const eligible = await findEligibleCustomerByEmail(email);
  if (!eligible) throw new CustomerAccountError("ineligible", "Customer registration is incomplete");
  const normalizedEmail = eligible.email.trim().toLowerCase();

  const [config, verifier] = await Promise.all([getOpenIdConfiguration(), Promise.resolve(randomBase64Url(48))]);
  const state = randomBase64Url();
  const nonce = randomBase64Url();
  const transaction: OAuthTransactionCookie = {
    kind: "oauth",
    state,
    nonce,
    verifier,
    email: normalizedEmail,
    returnTo: sanitiseReturnPath(returnTo),
  };
  const authorizationUrl = new URL(config.authorization_endpoint);
  authorizationUrl.searchParams.set("scope", "openid email customer-account-api:full");
  authorizationUrl.searchParams.set("client_id", customerAccountClientId());
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("redirect_uri", customerAccountCallbackUrl());
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("nonce", nonce);
  authorizationUrl.searchParams.set("login_hint", normalizedEmail);
  authorizationUrl.searchParams.set("code_challenge", await sha256Base64Url(verifier));
  authorizationUrl.searchParams.set("code_challenge_method", "S256");
  return { authorizationUrl: authorizationUrl.toString(), transactionCookie: await sealCookie(transaction, COOKIE_MAX_AGE.oauth) };
}

async function exchangeAuthorizationCode(code: string, transaction: OAuthTransactionCookie, config: OpenIdConfiguration): Promise<{ accessToken: string; idToken: string }> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: customerAccountClientId(),
    redirect_uri: customerAccountCallbackUrl(),
    code,
    code_verifier: transaction.verifier,
  });
  const response = await fetch(config.token_endpoint, {
    method: "POST",
    cache: "no-store",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      accept: "application/json",
      origin: canonicalOrigin(),
      "user-agent": "CellovaLabs-CustomerAccount/1.0",
    },
    body,
  });
  if (!response.ok) throw new CustomerAccountError("oauth", "Shopify Customer Account token exchange failed");
  const payload = (await response.json()) as { access_token?: unknown; id_token?: unknown };
  if (typeof payload.access_token !== "string" || typeof payload.id_token !== "string") {
    throw new CustomerAccountError("oauth", "Shopify Customer Account token response is incomplete");
  }
  return { accessToken: payload.access_token, idToken: payload.id_token };
}

async function verifyIdentityToken(idToken: string, transaction: OAuthTransactionCookie, config: OpenIdConfiguration): Promise<string | null> {
  const jwks = createRemoteJWKSet(new URL(config.jwks_uri));
  let payload;
  try {
    ({ payload } = await jwtVerify(idToken, jwks, { issuer: config.issuer, audience: customerAccountClientId() }));
  } catch {
    throw new CustomerAccountError("identity", "Shopify identity token validation failed");
  }
  if (payload.nonce !== transaction.nonce) throw new CustomerAccountError("identity", "Shopify identity token nonce validation failed");
  return typeof payload.email === "string" ? payload.email.trim().toLowerCase() : null;
}

async function customerApiEmail(accessToken: string): Promise<string | null> {
  const config = await getCustomerApiConfiguration();
  const response = await fetch(config.graphql_api, {
    method: "POST",
    cache: "no-store",
    headers: { "content-type": "application/json", authorization: `Bearer ${accessToken}`, origin: canonicalOrigin() },
    body: JSON.stringify({ query: "query CustomerIdentity { customer { emailAddress { emailAddress } } }" }),
  });
  if (!response.ok) throw new CustomerAccountError("identity", "Shopify Customer Account identity query failed");
  const payload = (await response.json()) as { data?: { customer?: { emailAddress?: { emailAddress?: string } } }; errors?: unknown[] };
  if (payload.errors?.length) throw new CustomerAccountError("identity", "Shopify Customer Account identity query failed");
  return payload.data?.customer?.emailAddress?.emailAddress?.trim().toLowerCase() ?? null;
}

export async function completeCustomerAccountAuthorization(code: string, returnedState: string | null, transaction: OAuthTransactionCookie): Promise<{ customer: EligibleCustomer; sessionCookie: string; returnTo: string }> {
  if (!code || !returnedState || returnedState !== transaction.state) throw new CustomerAccountError("oauth", "OAuth state validation failed");
  const config = await getOpenIdConfiguration();
  const { accessToken, idToken } = await exchangeAuthorizationCode(code, transaction, config);
  const tokenEmail = await verifyIdentityToken(idToken, transaction, config);
  const authenticatedEmail = tokenEmail ?? (await customerApiEmail(accessToken));
  if (!authenticatedEmail || authenticatedEmail !== transaction.email) throw new CustomerAccountError("identity", "Authenticated customer identity does not match the requested email");
  const customer = await findEligibleCustomerByEmail(authenticatedEmail);
  if (!customer) throw new CustomerAccountError("ineligible", "Customer registration is incomplete");
  const session: CellovaSessionCookie = { kind: "session", customerId: customer.id, email: customer.email, idToken };
  return { customer, sessionCookie: await sealCookie(session, COOKIE_MAX_AGE.session), returnTo: transaction.returnTo };
}

export async function getAuthorizedCustomer(session: CellovaSessionCookie | null): Promise<EligibleCustomer | null> {
  if (!session) return null;
  return findEligibleCustomerById(session.customerId, session.email);
}

export async function customerAccountLogoutUrl(idToken: string): Promise<string> {
  const config = await getOpenIdConfiguration();
  const destination = new URL(config.end_session_endpoint);
  destination.searchParams.set("id_token_hint", idToken);
  destination.searchParams.set("post_logout_redirect_uri", configuredLogoutUrl());
  return destination.toString();
}
