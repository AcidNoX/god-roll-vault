# God Roll Vault

Cross-platform Destiny 2 gear manager for tracking weapon god rolls (PVP/PVE) across web and mobile.

## Stack

- **Monorepo:** Turborepo + pnpm
- **Lint/format:** Biome
- **Web:** Vite + react-native-web
- **Mobile:** Expo
- **Shared UI:** `packages/ui`

## Prerequisites

- Node.js 20+
- pnpm 10+
- [Bungie.net API credentials](docs/bungie-setup.md) (for auth/inventory features)

## Getting Started

```bash
pnpm install
pnpm build
pnpm dev
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Biome lint + format check |
| `pnpm lint:fix` | Biome auto-fix |
| `pnpm typecheck` | Typecheck all packages |
| `pnpm test` | Run unit tests |
| `pnpm test:coverage` | Run unit tests with coverage |
| `pnpm test:e2e` | Run web E2E tests (Playwright) |
| `pnpm test:e2e:mobile` | Run mobile E2E tests (Maestro) |

## Project Structure

```
apps/
  web/              # Vite web app
  mobile/           # Expo mobile app
packages/
  vitest/           # Shared Vitest configs (node + react)
  config/           # Shared tsconfig
  core/             # God roll matching, domain types
  api/              # Bungie API + auth
  destiny-data/     # Weapon/perk/god-roll reference data
  ui/               # Shared cross-platform components
```

## Development

See [AGENTS.md](./AGENTS.md) for AI agent conventions and [CONTRIBUTING.md](./CONTRIBUTING.md) for the PR workflow.
