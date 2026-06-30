export type AuthConfig = {
  clientId: string;
  clientSecret: string | undefined;
  redirectUri: string;
};

export type BungieApiConfig = {
  apiKey: string;
};

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
  const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error(
      "Missing Bungie OAuth config. Add BUNGIE_CLIENT_ID and BUNGIE_CLIENT_SECRET to the repo root .env (see docs/bungie-setup.md), then restart the dev server.",
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
