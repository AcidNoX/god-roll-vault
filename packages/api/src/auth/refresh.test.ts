import { afterEach, describe, expect, it, vi } from "vitest";
import { BUNGIE_OAUTH_TOKEN_URL } from "./constants.js";
import type { OAuthError } from "./errors.js";
import {
  DEFAULT_TOKEN_EXPIRY_BUFFER_MS,
  isAccessTokenExpired,
  refreshTokensIfNeeded,
} from "./refresh.js";
import { InMemoryTokenStore } from "./token-store.js";
import type { AuthTokens } from "./types.js";

const TEST_CLIENT_ID = "12345";
const TEST_CLIENT_SECRET = "super-secret";
const NOW = 1_700_000_000_000;

function createTokens(overrides: Partial<AuthTokens> = {}): AuthTokens {
  return {
    accessToken: "access-token",
    refreshToken: "refresh-token",
    expiresAt: NOW + 3_600_000,
    membershipId: "4611686018467427902",
    ...overrides,
  };
}

describe("isAccessTokenExpired", () => {
  it("treats tokens inside the buffer window as expired", () => {
    const tokens = createTokens({
      expiresAt: NOW + DEFAULT_TOKEN_EXPIRY_BUFFER_MS - 1,
    });

    expect(isAccessTokenExpired(tokens, NOW)).toBe(true);
  });

  it("treats tokens outside the buffer window as valid", () => {
    const tokens = createTokens({
      expiresAt: NOW + DEFAULT_TOKEN_EXPIRY_BUFFER_MS + 1,
    });

    expect(isAccessTokenExpired(tokens, NOW)).toBe(false);
  });
});

describe("InMemoryTokenStore", () => {
  it("stores and clears tokens", async () => {
    const store = new InMemoryTokenStore();
    const tokens = createTokens();

    expect(await store.get()).toBeNull();

    await store.set(tokens);
    expect(await store.get()).toEqual(tokens);

    await store.clear();
    expect(await store.get()).toBeNull();
  });
});

describe("refreshTokensIfNeeded", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns null when the store is empty", async () => {
    const store = new InMemoryTokenStore();

    await expect(
      refreshTokensIfNeeded({
        store,
        clientId: TEST_CLIENT_ID,
        clientSecret: TEST_CLIENT_SECRET,
        now: NOW,
      }),
    ).resolves.toBeNull();
  });

  it("reuses a valid access token without calling Bungie", async () => {
    const store = new InMemoryTokenStore();
    const tokens = createTokens();
    await store.set(tokens);

    const mockFetch = vi.fn();
    const result = await refreshTokensIfNeeded({
      store,
      clientId: TEST_CLIENT_ID,
      clientSecret: TEST_CLIENT_SECRET,
      now: NOW,
      fetch: mockFetch,
    });

    expect(result).toEqual(tokens);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("refreshes an expired token and updates the store", async () => {
    const store = new InMemoryTokenStore();
    const expiredTokens = createTokens({ expiresAt: NOW - 1 });
    await store.set(expiredTokens);

    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          access_token: "new-access-token",
          token_type: "Bearer",
          expires_in: 3600,
          refresh_token: "new-refresh-token",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    vi.spyOn(Date, "now").mockReturnValue(NOW);

    const result = await refreshTokensIfNeeded({
      store,
      clientId: TEST_CLIENT_ID,
      clientSecret: TEST_CLIENT_SECRET,
      now: NOW,
      fetch: mockFetch,
    });

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(BUNGIE_OAUTH_TOKEN_URL);

    const body = new URLSearchParams(init.body as string);
    expect(body.get("grant_type")).toBe("refresh_token");
    expect(body.get("refresh_token")).toBe("refresh-token");

    expect(result).toEqual({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
      expiresAt: NOW + 3_600_000,
      membershipId: "4611686018467427902",
    });
    expect(await store.get()).toEqual(result);
  });

  it("clears the store when refresh is needed but no refresh token exists", async () => {
    const store = new InMemoryTokenStore();
    await store.set(
      createTokens({
        expiresAt: NOW - 1,
        refreshToken: "",
      }),
    );

    await expect(
      refreshTokensIfNeeded({
        store,
        clientId: TEST_CLIENT_ID,
        clientSecret: TEST_CLIENT_SECRET,
        now: NOW,
      }),
    ).rejects.toMatchObject({
      name: "OAuthError",
      error: "invalid_grant",
    } satisfies Partial<OAuthError>);

    expect(await store.get()).toBeNull();
  });
});
