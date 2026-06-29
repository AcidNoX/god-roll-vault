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
