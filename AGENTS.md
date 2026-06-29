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
pnpm lint          # Biome check (format + lint)
pnpm lint:fix      # Biome auto-fix
pnpm typecheck
pnpm test
```

## Branch Naming

`leehiggitt/lee-XX-short-description` (matches Linear issue branches)

## Definition of Done

- Code in the correct package
- Unit tests for business logic changes
- `pnpm lint typecheck test build` passes locally
- PR references the Linear issue ID
- CI checks (`lint`, `typecheck`, `test`) pass on the PR
