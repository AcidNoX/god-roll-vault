import { OAuthError } from "./errors.js";
import { refreshAccessToken } from "./tokens.js";
import type { AuthTokens, RefreshTokensIfNeededParams } from "./types.js";

export const DEFAULT_TOKEN_EXPIRY_BUFFER_MS = 60_000;

export function isAccessTokenExpired(
  tokens: AuthTokens,
  now = Date.now(),
  expiryBufferMs = DEFAULT_TOKEN_EXPIRY_BUFFER_MS,
): boolean {
  return tokens.expiresAt <= now + expiryBufferMs;
}

/**
 * Returns stored tokens, refreshing via Bungie when the access token is expired
 * or within the expiry buffer window.
 */
export async function refreshTokensIfNeeded({
  store,
  clientId,
  clientSecret,
  expiryBufferMs = DEFAULT_TOKEN_EXPIRY_BUFFER_MS,
  now = Date.now(),
  tokenUrl,
  fetch: fetchFn,
}: RefreshTokensIfNeededParams): Promise<AuthTokens | null> {
  const tokens = await store.get();
  if (!tokens) {
    return null;
  }

  if (!isAccessTokenExpired(tokens, now, expiryBufferMs)) {
    return tokens;
  }

  if (!tokens.refreshToken) {
    await store.clear();
    throw new OAuthError(
      401,
      "invalid_grant",
      "Access token expired and no refresh token is available",
    );
  }

  const refreshed = await refreshAccessToken({
    clientId,
    clientSecret,
    refreshToken: tokens.refreshToken,
    tokenUrl,
    fetch: fetchFn,
  });

  const nextTokens: AuthTokens = {
    ...refreshed,
    membershipId: refreshed.membershipId ?? tokens.membershipId,
    refreshExpiresAt: refreshed.refreshExpiresAt ?? tokens.refreshExpiresAt,
  };

  await store.set(nextTokens);
  return nextTokens;
}
