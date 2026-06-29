import { z } from "zod";

import { BUNGIE_OAUTH_TOKEN_URL } from "./constants.js";
import { OAuthError } from "./errors.js";
import type { AuthTokens, ExchangeCodeForTokensParams, RefreshAccessTokenParams } from "./types.js";

const bungieTokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
  refresh_expires_in: z.number().optional(),
  membership_id: z.union([z.string(), z.number()]).transform(String).optional(),
});

const oauthErrorResponseSchema = z.object({
  error: z.string(),
  error_description: z.string().optional(),
});

export function mapTokenResponseToAuthTokens(
  response: z.infer<typeof bungieTokenResponseSchema>,
  now = Date.now(),
  previous?: AuthTokens,
): AuthTokens {
  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token ?? previous?.refreshToken ?? "",
    expiresAt: now + response.expires_in * 1000,
    membershipId: response.membership_id ?? previous?.membershipId,
    refreshExpiresAt:
      response.refresh_expires_in !== undefined
        ? now + response.refresh_expires_in * 1000
        : previous?.refreshExpiresAt,
  };
}

async function requestOAuthTokens(
  body: URLSearchParams,
  clientId: string,
  clientSecret: string | undefined,
  fetchFn: typeof fetch,
  tokenUrl: string,
  previous?: AuthTokens,
): Promise<AuthTokens> {
  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded",
  });

  if (clientSecret) {
    const credentials = btoa(`${clientId}:${clientSecret}`);
    headers.set("Authorization", `Basic ${credentials}`);
  } else {
    body.set("client_id", clientId);
  }

  const response = await fetchFn(tokenUrl, {
    method: "POST",
    headers,
    body,
  });

  const json: unknown = await response.json();

  if (!response.ok) {
    const error = oauthErrorResponseSchema.safeParse(json);
    if (error.success) {
      throw new OAuthError(response.status, error.data.error, error.data.error_description);
    }

    throw new OAuthError(response.status, "unknown_error");
  }

  const tokens = bungieTokenResponseSchema.parse(json);
  return mapTokenResponseToAuthTokens(tokens, Date.now(), previous);
}

/**
 * Exchanges an authorization code for access (and optionally refresh) tokens.
 *
 * Bungie quirks:
 * - Confidential clients should authenticate via `Authorization: Basic` (client_id:client_secret).
 * - Public clients must send `client_id` in the body and will **not** receive a refresh token.
 * - Access tokens expire in ~3600s; refresh tokens last ~90 days for confidential clients.
 * - Token responses are plain JSON (not the Platform API envelope).
 */
export async function exchangeCodeForTokens({
  clientId,
  clientSecret,
  code,
  codeVerifier,
  redirectUri,
  tokenUrl = BUNGIE_OAUTH_TOKEN_URL,
  fetch: fetchFn = fetch,
}: ExchangeCodeForTokensParams): Promise<AuthTokens> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    code_verifier: codeVerifier,
    redirect_uri: redirectUri,
  });

  return requestOAuthTokens(body, clientId, clientSecret, fetchFn, tokenUrl);
}

/**
 * Refreshes an access token using a refresh token.
 *
 * Bungie does not include `scope` on refresh requests. The new access token
 * keeps the same scopes as the original grant.
 */
export async function refreshAccessToken({
  clientId,
  clientSecret,
  refreshToken,
  tokenUrl = BUNGIE_OAUTH_TOKEN_URL,
  fetch: fetchFn = fetch,
}: RefreshAccessTokenParams): Promise<AuthTokens> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  return requestOAuthTokens(body, clientId, clientSecret, fetchFn, tokenUrl, {
    accessToken: "",
    refreshToken,
    expiresAt: 0,
  });
}
