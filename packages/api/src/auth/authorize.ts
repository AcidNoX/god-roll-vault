import { BUNGIE_OAUTH_AUTHORIZE_URL } from "./constants.js";
import type { BuildAuthorizeUrlParams } from "./types.js";

/**
 * Builds the Bungie OAuth authorize URL for the authorization code flow.
 *
 * Bungie quirks (see https://github.com/Bungie-net/api/wiki/OAuth-Documentation):
 * - Do **not** include a `scope` query param — scope is fixed at app registration.
 * - `redirect_uri` is optional but must be an exact case-sensitive match when present.
 * - Always pass `state` for CSRF protection (in addition to PKCE).
 * - Prefer the system browser over embedded WebViews; Bungie discourages in-app web views.
 */
export function buildAuthorizeUrl({
  clientId,
  redirectUri,
  state,
  codeChallenge,
  authorizeUrl = BUNGIE_OAUTH_AUTHORIZE_URL,
}: BuildAuthorizeUrlParams): string {
  const url = new URL(authorizeUrl);

  url.searchParams.set("client_id", clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", state);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");

  return url.toString();
}
