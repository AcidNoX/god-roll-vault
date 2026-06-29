# Destiny static reference data (`packages/destiny-data`)

Hand-curated MVP subset of Bungie manifest hashes for weapon and perk display names. Used by `packages/api` inventory mappers and future god-roll matching — **not** a full manifest download.

## Data files

| File | Purpose |
|------|---------|
| `src/manifest/mvp-weapons.json` | `itemHash` → `{ name, tier }` |
| `src/manifest/mvp-plugs.json` | `plugHash` → `{ name }` |

Keys are decimal hash strings (matching Bungie inventory JSON). Values are human-readable names only — no icons, stats, or socket layouts.

## Lookup API

Exported from `@god-roll-vault/destiny-data`:

- `getWeaponName(itemHash)` — name or `Unknown Weapon ({hash})`
- `getWeaponTier(itemHash)` — tier or `Unknown`
- `getWeaponDefinition(itemHash)` — full entry or `undefined`
- `getPerkName(plugHash)` — name or `Unknown Perk ({hash})`

## Data sources

1. **[light.gg](https://www.light.gg/db/)** — item URLs use the Bungie hash: `https://www.light.gg/db/items/{hash}/…`
2. **[Bungie.net Manifest entity API](https://bungie-net.github.io/multi/operation_get_Destiny2-GetDestinyEntityDefinition.html)** — `GET /Destiny2/Manifest/DestinyInventoryItemDefinition/{hash}/` with `X-API-Key` to confirm names and tiers when curating

We do **not** ship or cache the full Destiny manifest (~hundreds of MB). Only hashes for ~50 popular weapons and their common perk pool are stored.

## Fixture hashes (LEE-38)

These hashes are pinned for unit tests and API inventory fixtures. Their names in JSON **intentionally override** live Bungie definitions:

| Hash | Name in MVP data |
|------|------------------|
| `1363886209` | Fatebringer (Timelost) |
| `2595497736` | Crafted Test Rifle |
| `3687335430` | Vault Test Shotgun |
| `1467527085` | Firefly |
| `3177301540` | Explosive Payload |
| `1820237385` | Fourth Times the Charm |
| `1710791522` | Rampage |
| `2847525152` | Accurized Rounds |

Do not change these without updating `packages/api` fixtures and mapper tests.

## Update process

1. Find the item hash on light.gg (URL or “API ID” on the item page).
2. Optionally verify via Bungie entity API (requires `BUNGIE_API_KEY` in `.env`).
3. Add the hash to `scripts/verify-manifest-hashes.mjs` (`weaponHashes` or `plugHashes`).
4. Run from repo root:

   ```bash
   node scripts/verify-manifest-hashes.mjs
   ```

   This rewrites `mvp-weapons.json` and `mvp-plugs.json`, re-applies fixture overrides, and prints counts.

5. Extend `packages/destiny-data/src/manifest/lookup.test.ts` if adding hashes used in tests.
6. Run `pnpm lint typecheck test build`.

## Scope notes

- Multiple hash variants exist for reissued weapons (e.g. Fatebringer Timelost S14 vs S26). Include variants players still hold in inventory.
- Perk plug hashes can differ from sandbox perk hashes; inventory sockets use **plug item** hashes (`DestinyInventoryItemDefinition`).
- `packages/destiny-data` must not import React (see `AGENTS.md`).
