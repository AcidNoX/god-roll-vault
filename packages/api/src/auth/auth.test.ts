import { afterEach, describe, expect, it, vi } from "vitest";

import { buildAuthorizeUrl } from "./authorize.js";
import { BUNGIE_OAUTH_AUTHORIZE_URL, BUNGIE_OAUTH_TOKEN_URL } from "./constants.js";
import type { OAuthError } from "./errors.js";
import { generatePkce } from "./pkce.js";
import { exchangeCodeForTokens } from "./tokens.js";

const TEST_CLIENT_ID = "12345";
const TEST_CLIENT_SECRET = "super-secret";
const TEST_REDIRECT_URI = "https://127.0.0.1:3000/auth/callback";
const TEST_STATE = "random-state-value";
const TEST_CODE = "auth-code-from-bungie";

function base64UrlEncode(bytes: Uint8Array): string {
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "");
}

async function deriveCodeChallenge(codeVerifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));
  return base64UrlEncode(new Uint8Array(digest));
}

describe("generatePkce", () => {
  it("produces an S256 code challenge from the verifier", async () => {
    const { codeVerifier, codeChallenge } = await generatePkce();

    expect(codeVerifier.length).toBeGreaterThanOrEqual(43);
    expect(codeChallenge).toBe(await deriveCodeChallenge(codeVerifier));
  });

  it("generates unique values on each call", async () => {
    const first = await generatePkce();
    const second = await generatePkce();

    expect(first.codeVerifier).not.toBe(second.codeVerifier);
    expect(first.codeChallenge).not.toBe(second.codeChallenge);
  });
});

describe("buildAuthorizeUrl", () => {
  it("includes required OAuth params and omits scope", async () => {
    const { codeChallenge } = await generatePkce();
    const url = new URL(
      buildAuthorizeUrl({
        clientId: TEST_CLIENT_ID,
        redirectUri: TEST_REDIRECT_URI,
        state: TEST_STATE,
        codeChallenge,
      }),
    );

    expect(url.origin + url.pathname).toBe(BUNGIE_OAUTH_AUTHORIZE_URL);
    expect(url.searchParams.get("client_id")).toBe(TEST_CLIENT_ID);
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("state")).toBe(TEST_STATE);
    expect(url.searchParams.get("redirect_uri")).toBe(TEST_REDIRECT_URI);
    expect(url.searchParams.get("code_challenge")).toBe(codeChallenge);
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.has("scope")).toBe(false);
  });
});

describe("exchangeCodeForTokens", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("exchanges a code using Basic auth for confidential clients", async () => {
    const codeVerifier = "test-verifier-value";
    const now = 1_700_000_000_000;
    vi.spyOn(Date, "now").mockReturnValue(now);

    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          access_token: "access-token",
          token_type: "Bearer",
          expires_in: 3600,
          refresh_token: "refresh-token",
          refresh_expires_in: 7_776_000,
          membership_id: "4611686018467427902",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const tokens = await exchangeCodeForTokens({
      clientId: TEST_CLIENT_ID,
      clientSecret: TEST_CLIENT_SECRET,
      code: TEST_CODE,
      codeVerifier,
      redirectUri: TEST_REDIRECT_URI,
      fetch: mockFetch,
    });

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(BUNGIE_OAUTH_TOKEN_URL);
    expect(init.method).toBe("POST");

    const headers = new Headers(init.headers);
    expect(headers.get("Content-Type")).toBe("application/x-www-form-urlencoded");
    expect(headers.get("Authorization")).toBe(
      `Basic ${btoa(`${TEST_CLIENT_ID}:${TEST_CLIENT_SECRET}`)}`,
    );

    const body = new URLSearchParams(init.body as string);
    expect(body.get("grant_type")).toBe("authorization_code");
    expect(body.get("code")).toBe(TEST_CODE);
    expect(body.get("code_verifier")).toBe(codeVerifier);
    expect(body.get("redirect_uri")).toBe(TEST_REDIRECT_URI);
    expect(body.has("client_id")).toBe(false);

    expect(tokens).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      expiresAt: now + 3_600_000,
      membershipId: "4611686018467427902",
      refreshExpiresAt: now + 7_776_000_000,
    });
  });

  it("sends client_id in the body for public clients without a secret", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          access_token: "mobile-access-token",
          token_type: "Bearer",
          expires_in: 3600,
          membership_id: 4352344,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const tokens = await exchangeCodeForTokens({
      clientId: TEST_CLIENT_ID,
      code: TEST_CODE,
      codeVerifier: "verifier",
      redirectUri: "godrollvault://auth/callback",
      fetch: mockFetch,
    });

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    const headers = new Headers(init.headers);
    const body = new URLSearchParams(init.body as string);

    expect(headers.has("Authorization")).toBe(false);
    expect(body.get("client_id")).toBe(TEST_CLIENT_ID);
    expect(tokens.refreshToken).toBe("");
    expect(tokens.membershipId).toBe("4352344");
  });

  it("throws OAuthError when Bungie returns an error response", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: "invalid_grant",
          error_description: "Invalid authorization code",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      ),
    );

    await expect(
      exchangeCodeForTokens({
        clientId: TEST_CLIENT_ID,
        clientSecret: TEST_CLIENT_SECRET,
        code: "bad-code",
        codeVerifier: "verifier",
        redirectUri: TEST_REDIRECT_URI,
        fetch: mockFetch,
      }),
    ).rejects.toMatchObject({
      name: "OAuthError",
      status: 400,
      error: "invalid_grant",
      errorDescription: "Invalid authorization code",
    } satisfies Partial<OAuthError>);
  });
});
