import type { PkcePair } from "./types.js";

const PKCE_VERIFIER_BYTES = 32;

function base64UrlEncode(bytes: Uint8Array): string {
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "");
}

/**
 * Generates a PKCE code verifier and S256 code challenge (RFC 7636).
 *
 * Bungie's OAuth wiki does not document PKCE, but we use it so the same auth
 * module works for mobile (public client) and adds defense-in-depth for web.
 */
export async function generatePkce(): Promise<PkcePair> {
  const verifierBytes = crypto.getRandomValues(new Uint8Array(PKCE_VERIFIER_BYTES));
  const codeVerifier = base64UrlEncode(verifierBytes);

  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));
  const codeChallenge = base64UrlEncode(new Uint8Array(digest));

  return { codeVerifier, codeChallenge };
}
