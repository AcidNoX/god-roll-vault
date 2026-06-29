# `@god-roll-vault/destiny-data`

Static Destiny reference data: MVP manifest lookups, weapon buckets, and curated god-roll recommendations.

## Manifest lookups

Weapon and perk display names live under `src/manifest/`. See [docs/destiny-data.md](../../docs/destiny-data.md) for curation workflow and Bungie hash sources.

## God roll JSON files

Curated recommendations live as one JSON file per weapon in `src/god-rolls/`. Each file describes one weapon and one or more target rolls:

```json
{
  "weaponHash": 1481892490,
  "weaponName": "The Palindrome (Adept)",
  "rolls": [
    {
      "mode": "pvp",
      "label": "Dueling",
      "perks": {
        "barrel": ["Arrowhead Brake"],
        "magazine": ["Accurized Rounds"],
        "perk1": ["Kill Clip"],
        "perk2": ["Rampage"]
      },
      "flexSlots": ["magazine"]
    }
  ]
}
```

### Field reference

| Field | Description |
|-------|-------------|
| `weaponHash` | Bungie `DestinyInventoryItemDefinition` hash (decimal). Must exist in `mvp-weapons.json`. |
| `weaponName` | Display name matching the manifest entry for `weaponHash`. |
| `rolls[].mode` | `pvp` or `pve` (same values as `GameMode` in `@god-roll-vault/core`). |
| `rolls[].label` | Short name for this roll build (e.g. "Dueling", "Boss DPS"). |
| `rolls[].perks` | Perk options per socket column. Keys: `barrel`, `magazine`, `perk1`, `perk2`, `perk3`, `originTrait`. Each value is a non-empty array of acceptable perk **names**. |
| `rolls[].flexSlots` | Socket columns where any listed perk is acceptable (subset of defined `perks` keys). |

Perk names must match entries in `src/manifest/mvp-plugs.json` (Bungie-verified plug display names). Add missing perks to the manifest before referencing them in god rolls.

### Adding a new god roll

1. Find the weapon hash on [light.gg](https://www.light.gg/db/) or the Bungie entity API (see `docs/destiny-data.md`).
2. Confirm the weapon is in `mvp-weapons.json`; extend the manifest if needed.
3. Confirm every perk name you plan to use exists in `mvp-plugs.json`; add plug hashes via `scripts/verify-manifest-hashes.mjs` when missing.
4. Create `src/god-rolls/<weapon-slug>.json` using the shape above. Copy `the-palindrome.json` as a template.
5. Validate from the repo root:

   ```bash
   pnpm validate-data
   ```

6. Run `pnpm lint typecheck test build`.

### Validation

- **Schema** — Zod schemas in `src/god-rolls/schema.ts` (`godRollEntrySchema`, etc.), exported from the package entry point.
- **Manifest cross-check** — validation helpers in `src/god-rolls/validate.ts` ensure weapon hashes, weapon names, and perk names align with MVP manifest data.
- **CLI** — `pnpm validate-data` (root) or `pnpm --filter @god-roll-vault/destiny-data validate-data` validates every `*.json` file in `src/god-rolls/`.

Validation failures print `file:path: message` lines and exit with code 1.

## Package boundaries

This package must not import React (see root `AGENTS.md`).
