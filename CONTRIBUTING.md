# Contributing

Thanks for contributing to God Roll Vault. Every change goes through Linear, a branch, and a pull request.

## Before you start

1. Find or create a [Linear issue](https://linear.app/lee-hs-workspace/project/god-roll-vault-3290434a60db) for the work
2. Branch from `main` using the naming convention below
3. Copy `.env.example` to `.env` if your work needs Bungie credentials (see [docs/bungie-setup.md](./docs/bungie-setup.md))

## Branch naming

```
<github_username>/<ticket-id-lowercase>
```

Example: `leehiggitt/lee-32`

## Pull requests

### Title format (required)

Use [conventional commits](https://www.conventionalcommits.org/) with the Linear ticket ID:

```
type(TICKET-ID): Short description
```

Examples:

- `docs(LEE-32): Add contributing guide and PR template`
- `feat(LEE-44): Implement god roll matching algorithm`

**Types:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, `build`

### PR checklist

Every PR must:

- [ ] Reference a Linear ticket in the description
- [ ] Use the conventional commit title format above
- [ ] Pass CI: `lint`, `typecheck`, `test`
- [ ] Include unit tests for business logic changes
- [ ] Stay within the correct package boundaries (see [AGENTS.md](./AGENTS.md))

`main` is protected — direct pushes are blocked. All merges go through PR.

## Local development

```bash
pnpm install
pnpm lint typecheck test build   # run before opening a PR
```

See [AGENTS.md](./AGENTS.md) for package boundaries, testing conventions, and agent-specific guidance.

## Dependencies

Shared dependency versions live in the `catalog` section of `pnpm-workspace.yaml`. Any package used in two or more `package.json` files must use `"catalog:"` — never duplicate version strings.

All versions are exact pins (no `^` or `~`). Single-package deps are pinned literally in that package's `package.json`.

## Environment variables

Copy `.env.example` to `.env` at the repo root. Never commit `.env`.

| Variable | Required for | Description |
|----------|--------------|-------------|
| `BUNGIE_API_KEY` | API calls | Bungie.net application API key |
| `BUNGIE_CLIENT_ID` | OAuth | OAuth client ID |
| `BUNGIE_CLIENT_SECRET` | OAuth (server) | OAuth client secret — keep local only |
| `OAUTH_REDIRECT_URI_WEB` | Web app | Web OAuth callback URL |
| `OAUTH_REDIRECT_URI_MOBILE` | Mobile app | Expo deep link callback |

Full setup: [docs/bungie-setup.md](./docs/bungie-setup.md)
