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
pnpm test:coverage   # unit tests with v8 coverage
```

## Tickets, Branches, and PRs

Every change goes through a Linear ticket, a branch, and a pull request. Do not push directly to `main`.

### Linear ticket

- Create or pick up a Linear issue before starting work
- Every PR must reference its ticket in the description (link or ID)

### Branch naming

```
<github_username>/<ticket-id-lowercase>
```

Example: `leehiggitt/lee-66`

### PR title (conventional commits)

```
type(TICKET-ID): Short description
```

Examples:

- `chore(LEE-66): Document PR and branch conventions`
- `feat(LEE-44): Implement god roll matching algorithm`
- `ci(LEE-65): Add GitHub Actions workflow`

**Types:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, `build`

## Definition of Done

- Code in the correct package
- Unit tests for business logic changes (use `@god-roll-vault/vitest/node` or `/react`)
- `pnpm lint typecheck test build` passes locally
- PR has an associated Linear ticket and uses the title format above
- CI checks (`lint`, `typecheck`, `test`) pass on the PR
