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
- [Bungie API data reference](docs/bungie-api-data.md) (response shapes for domain modeling)

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

## Mobile E2E (Maestro)

Mobile smoke tests use [Maestro](https://maestro.mobile.dev/) against **Expo Go** on a simulator or emulator.

### Prerequisites

1. Install the [Maestro CLI](https://maestro.mobile.dev/getting-started/installing-maestro)
2. Start an **iOS Simulator** (macOS) or **Android Emulator**
3. Install **Expo Go** on the simulator/emulator

### Run locally

```bash
# Terminal 1 — Metro dev server (port 8081)
pnpm --filter @god-roll-vault/mobile dev

# Terminal 2 — Maestro flows (simulator must be running)
pnpm test:e2e:mobile
```

Flows live in `apps/mobile/.maestro/`. The smoke test opens the app via Expo Go and asserts the home screen (`app-root`, `app-title`).

**Android emulator:** Metro is reachable at `10.0.2.2` instead of `localhost`. Set the URL before running:

```bash
# PowerShell
$env:EXPO_URL = "exp://10.0.2.2:8081/--/"
pnpm test:e2e:mobile

# bash
EXPO_URL=exp://10.0.2.2:8081/--/ pnpm test:e2e:mobile
```

Maestro is not run in GitHub Actions yet — it requires a simulator and Expo Go, so it remains a local (or Maestro Cloud) gate for now.

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
