# Bungie API — Data We Consume

Reference for M1 domain modeling. Shapes are from the official [OpenAPI spec](https://github.com/Bungie-net/api/blob/master/openapi.json) and [Bungie.net API docs](https://bungie-net.github.io/).

## Response envelope

All endpoints return:

```json
{
  "Response": { },
  "ErrorCode": 1,
  "ThrottleSeconds": 0,
  "ErrorStatus": "Success",
  "Message": "Ok",
  "MessageData": { }
}
```

`ErrorCode === 1` means success. Handle throttling via `ThrottleSeconds` and HTTP 429.

## Auth → membership → profile flow

```
OAuth token
    → GET /User/GetMembershipsForCurrentUser/
        → destinyMemberships[], primaryMembershipId, bungieNetUser
    → GET /Destiny2/{membershipType}/Profile/{destinyMembershipId}/LinkedProfiles/
        → cross-save / platform membership IDs (if needed)
    → GET /Destiny2/{membershipType}/Profile/{destinyMembershipId}/?components=...
        → characters, inventories, item details
```

### `User.UserMembershipData` (memberships)

| Field | Type | Maps to |
|-------|------|---------|
| `destinyMemberships[]` | `GroupUserInfoCard` | Platform accounts (Steam, Xbox, PSN, etc.) |
| `primaryMembershipId` | int64 | Default membership for cross-save |
| `bungieNetUser` | `GeneralUser` | Bungie.net profile |

Each membership includes `membershipType`, `membershipId`, `displayName`, `bungieGlobalDisplayName`.

### `DestinyCharacterComponent` (component `200`)

Request via `GetProfile` with `components=200` (`Characters`).

| Field | Type | Use |
|-------|------|-----|
| `characterId` | int64 | Key for inventory buckets |
| `classType` | int | Titan / Hunter / Warlock |
| `light` | int | Power level |
| `dateLastPlayed` | string | Sort “last played” |
| `emblemHash`, `emblemPath` | | UI avatar |

## Inventory — `GetProfile` components

Primary endpoint:

```
GET /Destiny2/{membershipType}/Profile/{destinyMembershipId}/?components={csv}
```

### Components we need (MVP)

| ID | Name | Scope / notes |
|----|------|----------------|
| 100 | Profiles | Account profile metadata |
| 102 | ProfileInventories | **Vault** items |
| 200 | Characters | Character list |
| 201 | CharacterInventories | **Unequipped** items per character |
| 205 | CharacterEquipment | **Equipped** items per character |
| 300 | ItemInstances | Power, damage type, equipped flag |
| 304 | ItemStats | Stat rolls |
| 305 | ItemSockets | **Perks / mods / shaders** (plug hashes) |
| 307 | ItemPlugStates | Socket enablement |
| 308 | ItemReusablePlugs | Alternatives (e.g. selectable perks) |

Minimum for god roll checking: **102, 200, 201, 205, 300, 305** (add 308 if we need reusable plug options).

Requires **ReadDestinyInventoryAndVault** scope. Components may be omitted if the user’s privacy settings block them — always handle missing components gracefully.

### `DestinyItemComponent` (inventory entry)

| Field | Type | Maps to `InventoryWeapon` |
|-------|------|---------------------------|
| `itemHash` | uint32 | Weapon definition (name, type from manifest) |
| `itemInstanceId` | int64 | Unique owned instance |
| `bucketHash` | uint32 | Location (kinetic, energy, power, vault, etc.) |
| `quantity` | int | Stack size (weapons = 1) |
| `state` | bitmask | Masterwork, crafted, etc. |

### Perk data — sockets + plugs

Weapon perks are **not** plain strings in the inventory response. They live in `itemComponents`:

- **`ItemSockets` (305):** `sockets.data[itemInstanceId].sockets[]` → `DestinyItemSocketState`
  - `plugHash` — references manifest plug definition (perk name/icon)
  - `isEnabled`, `isVisible`
- **`ItemInstances` (300):** `primaryStat.value` → power level; `damageTypeHash` → element
- **`ItemReusablePlugs` (308):** selectable perk columns for crafted weapons

Join `plugHash` / `itemHash` with **Destiny manifest** (or our curated `packages/destiny-data` subset) to get display names and optional `displayProperties.icon` asset paths.

### Privacy behavior

- `characterInventories` and `profileInventory` may return `{ items: [], privacy: 2 }` when the user hides inventory.
- User may need to enable privacy toggles and **re-authorize** the app.

## Suggested domain mapping (→ `packages/core`)

| Our type | Bungie sources |
|----------|----------------|
| `DestinyMembership` | `UserMembership` / `GroupUserInfoCard` |
| `DestinyCharacter` | `DestinyCharacterComponent` |
| `InventoryWeapon` | `DestinyItemComponent` + `ItemInstance` + socket plugs |
| `WeaponPerks` | Socket categories (barrel, mag, traits) from plug hashes + manifest |
| `ItemLocation` | `bucketHash` → character vs vault |

## Manifest / static data

Item and perk **names** come from the Destiny manifest (large JSON). MVP plan (`LEE-42`):

- Hand-curate a subset in `packages/destiny-data`, or
- Download manifest slices and cache locally

Do not call manifest endpoints on every inventory refresh.

## Useful links

- [GetProfile](https://bungie-net.github.io/multi/operation_get_Destiny2-GetProfile.html)
- [GetMembershipsForCurrentUser](https://bungie-net.github.io/multi/operation_get_User-GetMembershipsForCurrentUser.html)
- [DestinyComponentType enum](https://bungie-net.github.io/multi/schema_Destiny-DestinyComponentType.html)
- [Component dependency FAQ](https://github.com/Bungie-net/api#common-object-properties)

## Next implementation tickets

1. **LEE-33** — `BungieClient` + response envelope parsing
2. **LEE-35** — OAuth PKCE / token exchange
3. **LEE-37** — Memberships + characters
4. **LEE-38** — Profile + inventory parsing → `InventoryWeapon`
5. **LEE-40** — Domain types (can start in parallel with above)
