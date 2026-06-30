export type AuthConfig = {
  clientId: string;
  clientSecret: string | undefined;
  redirectUri: string;
};

export type BungieApiConfig = {
  apiKey: string;
};

/** Bungie requires an exact redirect URI match — use the host the app is served from. */
export function resolveOAuthRedirectUri(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return new URL("/auth/callback", window.location.origin).href;
  }

  return import.meta.env.VITE_OAUTH_REDIRECT_URI || "";
}

export function getBungieApiConfig(): BungieApiConfig {
  const apiKey = import.meta.env.VITE_BUNGIE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing Bungie API key. Add BUNGIE_API_KEY to the repo root .env (see docs/bungie-setup.md), then restart the dev server.",
    );
  }

  return { apiKey };
}

export function getAuthConfig(): AuthConfig {
  const clientId = import.meta.env.VITE_BUNGIE_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_BUNGIE_CLIENT_SECRET || undefined;
  const redirectUri = resolveOAuthRedirectUri();

  if (!clientId || !redirectUri) {
    throw new Error(
      "Missing Bungie OAuth config. Set BUNGIE_CLIENT_ID (local: repo root .env; Vercel: project env vars). See docs/bungie-setup.md.",
    );
  }

  return { clientId, clientSecret, redirectUri };
}

export function getAuthConfigError(): string | null {
  try {
    getAuthConfig();
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "Missing OAuth configuration";
  }
}
