# Agent Guide

## Package Boundaries

- `packages/core` and `packages/destiny-data` must not import React
- `packages/api` handles Bungie HTTP + auth only
- `packages/ui` contains shared visual components (react-native primitives)
- Apps (`web`, `mobile`) wire auth storage, routing, and platform APIs

## UI Component Organization

`packages/ui` uses atomic design under `packages/ui/src/components`:

- `atoms/` — lowest-level primitives and simple wrappers (`Box`, `Text`, `Pressable`, `Stack`, `AppText`)
- `molecules/` — small composed UI blocks (`WeaponCard`)
- `organisms/` — larger feature sections when needed
- `templates/` — screen/page-level layout wrappers (`Screen`)

Every UI component must live in its own directory with a local barrel:

```text
components/atoms/Box/
  index.ts
  Box.tsx
  Box.types.ts
  Box.test.ts
  Box.utils.ts        # when needed
  Box.styles.ts       # when needed
  Box.constants.ts    # when needed
  hooks/
    useMyHook/
      index.ts
      useMyHook.ts
      useMyHook.test.ts
```

Rules:

- Export each component through its own `index.ts`, then re-export through the atomic-design layer barrel and `packages/ui/src/index.ts`.
- Keep prop/type definitions in `Component.types.ts`.
- Keep non-trivial style objects in `Component.styles.ts`.
- Keep reusable helpers in `Component.utils.ts`; keep static presentation maps in `Component.constants.ts`.
- Put component tests in the component directory (`Component.test.ts` or `Component.test.tsx` when JSX is needed).
- Prefer composing shared UI components from lower-level atoms before reaching directly for `react-native` primitives.

## Storybook

Shared UI components are documented in Storybook under `packages/ui`.

- Colocate stories beside components: `Component.stories.tsx` in each component directory (alongside `Component.test.ts`).
- Story discovery: `packages/ui/src/**/*.stories.@(ts|tsx)`.
- Shared weapon/inventory fixtures live in `packages/ui/src/stories/fixtures/`.
- All stories are wrapped in `ThemeProvider` via the global decorator in `packages/ui/.storybook/preview.tsx` (dark theme default).
- Local authoring: `pnpm storybook` (port 6006, HMR).
- Static catalog for the web app: `pnpm storybook:build` outputs to `apps/web/public/storybook/` and is served at `/storybook/`.

## Commands

```bash
pnpm install
pnpm build
pnpm lint          # Biome check (format + lint)
pnpm lint:fix      # Biome auto-fix
pnpm typecheck
pnpm test
pnpm test:coverage   # unit tests with v8 coverage
pnpm storybook       # UI component catalog (port 6006)
pnpm storybook:build # static Storybook bundle for apps/web/public/storybook/
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

## Testing

Use `@god-roll-vault/vitest` shared configs. Add `*.test.ts` (or `*.test.tsx` when JSX is needed) next to the source under test.

| Package | Config import | Environment |
|---------|---------------|-------------|
| `core`, `api`, `destiny-data` | `@god-roll-vault/vitest/node` | Node |
| `ui` | `@god-roll-vault/vitest/react` | jsdom |
| `apps/*` | E2E only (Playwright / Maestro) — no unit test harness yet |

**Required:** unit tests for all business logic in `core`, `api`, and `destiny-data`.  
**UI:** component tests when adding non-trivial components.  
**Apps:** covered by E2E smoke tests (see Linear tickets LEE-29, LEE-30).

## Definition of Done

- Code in the correct package
- Unit tests for business logic changes (use `@god-roll-vault/vitest/node` or `/react`)
- `pnpm lint typecheck test build` passes locally
- PR has an associated Linear ticket and uses the title format above
- CI checks (`lint`, `typecheck`, `test`) pass on the PR
