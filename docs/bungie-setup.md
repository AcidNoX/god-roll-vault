# Bungie.net Setup

Register one or two applications at the [Bungie Application Portal](https://www.bungie.net/en/Application). You must be signed in to Bungie.net to create apps.

## Why two applications?

Bungie allows **one redirect URL per application**. Bungie also **rejects `http://` redirect URLs** — local web dev uses `https://127.0.0.1:3000` (not `localhost`).

| App | Redirect URL | Used by |
|-----|--------------|---------|
| **God Roll Vault (Web)** | `https://127.0.0.1:3000/auth/callback` | `apps/web` dev / local |
| **God Roll Vault (Mobile)** | `godrollvault://auth/callback` | `apps/mobile` (Expo) |

For production, create additional Bungie apps (or rotate keys) with your deployed web URL — Bungie does not support multiple redirect URIs on a single app ([issue #1255](https://github.com/Bungie-net/api/issues/1255)).

## Register an application

1. Open https://www.bungie.net/en/Application
2. Click **Create New App** (or equivalent)
3. Fill in:
   - **Name:** `God Roll Vault (Web)` or `God Roll Vault (Mobile)`
   - **Website:** your repo or project URL (e.g. GitHub)
   - **Application Type:** **Confidential** (server can hold `client_secret`; required for refresh tokens)
   - **OAuth Client Type:** Confidential
   - **Redirect URL:** see table above (exact match, case-sensitive)
   - **Origin:** `https://127.0.0.1:3000` for the web dev app (CORS; Bungie rejects `http://`)
4. Under **Scopes**, enable:
   - **ReadBasicUserProfile** — always included; memberships + linked profiles
   - **ReadDestinyInventoryAndVault** — character inventories, equipment, vault (required for weapons)
5. Save and copy credentials into `.env` (never commit):

| Portal field | `.env` variable |
|--------------|-----------------|
| API Key | `BUNGIE_API_KEY` |
| OAuth client_id | `BUNGIE_CLIENT_ID` |
| OAuth client_secret | `BUNGIE_CLIENT_SECRET` |

Use the **web** app's credentials in `.env` for local web development. Mobile will use its own client ID/secret via app-specific env when we wire OAuth (LEE-61).

## Local environment

```bash
cp .env.example .env
# Edit .env with credentials from the Bungie portal
```

```env
BUNGIE_API_KEY=
BUNGIE_CLIENT_ID=
BUNGIE_CLIENT_SECRET=

OAUTH_REDIRECT_URI_WEB=https://127.0.0.1:3000/auth/callback
OAUTH_REDIRECT_URI_MOBILE=godrollvault://auth/callback
```

`.env` is gitignored. Do not commit API keys or client secrets.

The web dev server reads the repo root `.env` automatically (`BUNGIE_CLIENT_ID` / `BUNGIE_CLIENT_SECRET` map to the Vite client). After editing `.env`, restart `pnpm dev`. Optional override: `apps/web/.env.local` with `VITE_BUNGIE_*` vars.

## OAuth flow (summary)

Bungie uses OAuth 2.0 authorization code flow ([wiki](https://github.com/Bungie-net/api/wiki/OAuth-Documentation)).

1. Redirect user to  
   `https://www.bungie.net/en/oauth/authorize?client_id={CLIENT_ID}&response_type=code&state={RANDOM}`
2. User approves; Bungie redirects to your **registered** redirect URL with `?code=...&state=...`
3. Exchange code at `POST https://www.bungie.net/Platform/App/OAuth/Token/`  
   (`grant_type=authorization_code`, `client_id`, `client_secret`, `code`)
4. Call API with headers:  
   `X-API-Key: {API_KEY}` and `Authorization: Bearer {access_token}`

Notes:

- Do **not** pass a `scope` query param — scope is fixed at app registration.
- Use `state` for CSRF protection.
- Access tokens expire in ~3600s; confidential clients receive a refresh token (~90 days).
- Use the system browser for login (not an in-app WebView) — Bungie discourages embedded web views.

## Required scopes (portal names)

| Scope | Value | What we need it for |
|-------|-------|---------------------|
| ReadBasicUserProfile | 1 | `GetMembershipsForCurrentUser`, linked Destiny memberships |
| ReadDestinyInventoryAndVault | 64 | Character/vault inventory, equipment, weapon perks |

## Redirect URI reference

| Platform | URI | Notes |
|----------|-----|-------|
| Web (local) | `https://127.0.0.1:3000/auth/callback` | Bungie rejects `http://`; use `127.0.0.1` not `localhost` |
| Mobile | `godrollvault://auth/callback` | Matches `scheme` in `apps/mobile/app.json` |

## Privacy settings

Users must allow inventory visibility in Destiny privacy settings (**Show my non-equipped Inventory**, etc.). If a component is missing from API responses, check privacy settings and re-authorize the app after changing them ([API issue #116](https://github.com/Bungie-net/api/issues/116)).

## References

- [Bungie API Wiki](https://github.com/Bungie-net/api/wiki)
- [OAuth Documentation](https://github.com/Bungie-net/api/wiki/OAuth-Documentation)
- [Scopes](https://github.com/Bungie-net/api/wiki/Scopes)
- [Application Portal](https://github.com/Bungie-net/api/wiki/Bungie.net-Application-Portal)
- [API data shapes for our domain models](./bungie-api-data.md)
