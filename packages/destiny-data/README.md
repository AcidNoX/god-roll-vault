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

### Starter dataset (LEE-43)

Twenty curated weapons in `src/god-rolls/` — one JSON file per weapon. Legendaries include PVP and PVE rolls where both modes apply; fixed-roll exotics document a single recommended mode. Perk names are limited to the current `mvp-plugs.json` pool and will expand as the manifest grows.

| Weapon | Hash | Category | light.gg |
|--------|------|----------|----------|
| The Palindrome (Adept) | `1481892490` | Hand cannon | [link](https://www.light.gg/db/items/1481892490/) |
| Eyasluna | `235827225` | Hand cannon | [link](https://www.light.gg/db/items/235827225/) |
| Austringer | `2429822977` | Hand cannon | [link](https://www.light.gg/db/items/2429822977/) |
| Fatebringer (Timelost) | `4219826183` | Hand cannon | [link](https://www.light.gg/db/items/4219826183/) |
| Igneous Hammer | `1973107014` | Hand cannon | [link](https://www.light.gg/db/items/1973107014/) |
| Rose | `882778888` | Hand cannon | [link](https://www.light.gg/db/items/882778888/) |
| Blast Furnace | `2533990645` | Pulse rifle | [link](https://www.light.gg/db/items/2533990645/) |
| Outbreak Perfected | `400096939` | Pulse rifle (Exotic) | [link](https://www.light.gg/db/items/400096939/) |
| Dead Man's Tale | `3654674561` | Scout rifle (Exotic) | [link](https://www.light.gg/db/items/3654674561/) |
| Beloved | `4190932264` | Sniper rifle | [link](https://www.light.gg/db/items/4190932264/) |
| Deliverance | `768621510` | Fusion rifle | [link](https://www.light.gg/db/items/768621510/) |
| The Recluse | `3098328572` | Submachine gun | [link](https://www.light.gg/db/items/3098328572/) |
| Hammerhead | `1896309757` | Machine gun | [link](https://www.light.gg/db/items/1896309757/) |
| Forbearance | `613334176` | Grenade launcher | [link](https://www.light.gg/db/items/613334176/) |
| The Mountaintop | `4043921923` | Grenade launcher | [link](https://www.light.gg/db/items/4043921923/) |
| Witherhoard | `2357297366` | Grenade launcher (Exotic) | [link](https://www.light.gg/db/items/2357297366/) |
| The Hothead | `4255171531` | Rocket launcher | [link](https://www.light.gg/db/items/4255171531/) |
| Stormchaser | `3652506829` | Linear fusion rifle | [link](https://www.light.gg/db/items/3652506829/) |
| Cataclysmic (Adept) | `2886339027` | Linear fusion rifle | [link](https://www.light.gg/db/items/2886339027/) |
| Falling Guillotine | `614426548` | Sword | [link](https://www.light.gg/db/items/614426548/) |

Roll recommendations were informed by community consensus on light.gg god-roll pages and in-game perk pools; expand `mvp-plugs.json` before adding perks not yet in the manifest.

## Package boundaries

This package must not import React (see root `AGENTS.md`).
