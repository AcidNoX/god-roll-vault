export type AuthConfig = {
  clientId: string;
  clientSecret: string | undefined;
  redirectUri: string;
};

export function getAuthConfig(): AuthConfig {
  const clientId = import.meta.env.VITE_BUNGIE_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_BUNGIE_CLIENT_SECRET || undefined;
  const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error("Missing VITE_BUNGIE_CLIENT_ID or VITE_OAUTH_REDIRECT_URI");
  }

  return { clientId, clientSecret, redirectUri };
}
