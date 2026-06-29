# Agent Guide

## Package Boundaries

- `packages/core` and `packages/destiny-data` must not import React
- `packages/api` handles Bungie HTTP + auth only
- `packages/ui` contains shared visual components (react-native primitives)
- Apps (`web`, `mobile`) wire auth storage, routing, and platform APIs

## Commands

```bash
pnpm install
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

## Branch Naming

`leehiggitt/lee-XX-short-description` (matches Linear issue branches)

## Definition of Done

- Code in the correct package
- Unit tests for business logic changes
- `pnpm turbo lint typecheck test build` passes
- PR references the Linear issue ID

## Cursor Cloud specific instructions

- Toolchain: Node 20+ and pnpm 10 are preinstalled; `pnpm install` (the startup update script) is all that's needed to refresh deps.
- Web app: run `pnpm --filter @god-roll-vault/web dev` (Vite) and open http://localhost:3000. Vite aliases `@god-roll-vault/*` to package `src`, so dev/run does not require a prior `pnpm build`.
- Mobile app (`apps/mobile`): `pnpm --filter @god-roll-vault/mobile dev` launches Expo/Metro (default 8081); needs a device/emulator or Expo Go to view, so the web app is the simplest fully-runnable target in the cloud VM.
- React version pin: `react` is held at `19.0.0` by `react-native@0.79.2`, but `react-dom` floats to a newer `^19` and React 19 requires the two to match exactly (otherwise the web app renders blank with an "Incompatible React versions" console error). Root `package.json` `pnpm.overrides` pins both `react` and `react-dom` to `19.0.0` to fix this — keep that override.
- Known pre-existing failure (not env-related): `pnpm typecheck` fails in `apps/web` and `apps/mobile` with `Cannot find module '@god-roll-vault/ui'`. Cause: `packages/ui/package.json` `exports` points to `./src/index.ts` but the file is `src/index.tsx`. `lint`, `test`, `build`, and dev run are all green.
