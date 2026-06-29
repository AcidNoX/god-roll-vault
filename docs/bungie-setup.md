# Bungie.net Setup

1. Create an application at https://www.bungie.net/en/Application
2. Copy the API key and OAuth credentials into `.env` (see `.env.example`)
3. Register redirect URIs:
   - Web: `http://localhost:3000/auth/callback`
   - Mobile: `godrollvault://auth/callback`

## Required Scopes

- `Memberships.Read`
- `Destiny2.Read`

## References

- [Bungie API Wiki](https://github.com/Bungie-net/api/wiki)
- [OAuth Documentation](https://github.com/Bungie-net/api/wiki/OAuth-Documentation)
