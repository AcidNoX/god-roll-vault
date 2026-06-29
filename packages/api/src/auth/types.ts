import type { TokenStore } from "./token-store.js";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  membershipId?: string;
  refreshExpiresAt?: number;
};

export type PkcePair = {
  codeVerifier: string;
  codeChallenge: string;
};

export type BuildAuthorizeUrlParams = {
  clientId: string;
  redirectUri: string;
  state: string;
  codeChallenge: string;
  authorizeUrl?: string;
};

export type ExchangeCodeForTokensParams = {
  clientId: string;
  code: string;
  codeVerifier: string;
  redirectUri: string;
  /** Required for confidential clients (web). Omit for public clients (mobile). */
  clientSecret?: string;
  tokenUrl?: string;
  fetch?: typeof fetch;
};

export type RefreshAccessTokenParams = {
  clientId: string;
  refreshToken: string;
  /** Required for confidential clients (web). Omit for public clients (mobile). */
  clientSecret?: string;
  tokenUrl?: string;
  fetch?: typeof fetch;
};

export type RefreshTokensIfNeededParams = {
  store: TokenStore;
  clientId: string;
  clientSecret?: string;
  /** Refresh when access token expires within this window. Default: 60s. */
  expiryBufferMs?: number;
  now?: number;
  tokenUrl?: string;
  fetch?: typeof fetch;
};
