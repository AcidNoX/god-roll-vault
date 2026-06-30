# Design system (DIM / Ishtar Commander)

God Roll Vault targets the visual density and dark companion aesthetic of **Destiny Item Manager (DIM)** and **Ishtar Commander** — not generic app chrome.

**Figma (source of truth for mocks):** https://www.figma.com/design/wxhNTKhoNRnnRP3MQsmrwq/Untitled

**Code tokens (LEE-70):** `design/tokens/design-tokens.json`  
**Figma import:** `design/tokens/figma-tokens.json` (Tokens Studio plugin)

---

## Figma file structure

Create three top-level pages in the Figma file:

### 1. Tokens

Collections / variable groups to define:

| Group | Examples |
|-------|----------|
| `color/app` | background `#313233`, surface `#252627`, header `#000` |
| `color/border` | default, focus (`#4887ba` — DIM selection blue) |
| `color/text` | primary, secondary, muted |
| `color/brand` | DIM gold `#e8a534`, error, success |
| `color/rarity` | common → exotic (in-game tier colors) |
| `color/element` | arc, solar, void, stasis, strand, kinetic |
| `color/godRoll` | perfect / partial / missing / unknown |
| `typography` | Inter UI + Helvetica destiny headers |
| `spacing` | 4px base grid |
| `radius` | 4 / 6 / 8px (DIM uses 6px search + tooltips) |
| `size` | item tile 50px, perk icon 32px, header 48px |

Import `design/tokens/figma-tokens.json` via **Tokens Studio** to seed variables, then refine in Figma.

### 2. Components

Build from tokens (component properties bound to variables):

| Component | Notes |
|-----------|-------|
| **Item tile** | 50×50, 1px border, rarity tint, power badge, element strip |
| **Item tile — equipped** | Gold/orange outer ring (`#e8a534`), 2px padding |
| **God roll badge** | Pill on tile corner; gold / silver / red / gray variants |
| **Perk row** | 32px icon + label; green match / red miss / neutral |
| **Search bar** | 28px height, 6px radius, dark inset bg |
| **Mode toggle** | PVP / PVE segmented control |
| **Character emblem** | 237×48 strip (Destiny native aspect) |
| **Button** | Primary = brand gold; secondary = surface + border |

Reference frames: pin screenshots from DIM inventory grid and Ishtar item popup beside components.

### 3. Screens

Desktop-first **1280px** artboards; note mobile breakpoints at **540px** (DIM `phone-portrait`).

| Screen | DIM / Ishtar patterns |
|--------|----------------------|
| **App shell** | Black header bar, character strip, search, mode toggle |
| **Inventory** | Dense weapon grid, sort controls, god roll indicators on tiles |
| **Weapon detail** | Slide-over or panel: large tile, perk sockets, god roll comparison |
| **Login** | Centered card on `#313233`, Bungie CTA in brand gold |
| **Settings** | Section cards on `#222` surface |

---

## Color philosophy

### Surfaces (DIM classic theme)

DIM uses flat dark grays, not purple gradients:

| Token | Hex | Usage |
|-------|-----|-------|
| `app.background` | `#313233` | Main app canvas |
| `app.backgroundDeep` | `#222222` | Settings sections, side panels |
| `app.surface` | `#252627` | Cards, alternating rows |
| `app.header` | `#000000` | Top navigation bar |

Our earlier purple void theme (`#0f0920`) is **deprecated** for v1 — see LEE-72 for code migration.

### Brand & accents

| Token | Hex | Source |
|-------|-----|--------|
| `brand.primary` | `#e8a534` | DIM `$dim-brand` |
| `border.focus` | `#4887ba` | DIM selection / plugged perk blue |
| `brand.community` | `#0d7fad` | Community data callouts |

### Rarity (in-game tier colors)

From [DIM `_variables.scss`](https://github.com/DestinyItemManager/DIM/blob/master/src/app/_variables.scss):

| Tier | Hex |
|------|-----|
| Common | `#dcdcdc` |
| Uncommon | `#366e42` |
| Rare | `#5076a3` |
| Legendary | `#513065` |
| Exotic | `#c3a019` |

Use as **border / underline** on item tiles, not full fill.

### Elements

| Element | Hex |
|---------|-----|
| Kinetic | `#d6d3c5` |
| Arc | `#79bbe8` |
| Solar | `#f0631e` |
| Void | `#8e749e` |
| Stasis | `#4d88ff` |
| Strand | `#35e366` |
| Prismatic | `#e3619b` |

### God roll status

| Status | Border | Meaning |
|--------|--------|---------|
| Perfect | `#f5dc56` (DIM power gold) | All required perks match |
| Partial | `#c7ccd8` | Some perks match |
| Missing | `#ff3232` | Wrong roll |
| Unknown | `#6d6e70` | No god roll data |

---

## Typography

Dense UI — smaller than typical consumer apps.

| Role | Size | Weight | Usage |
|------|------|--------|-------|
| Caption | 11px | 600 | Badges, stat labels |
| Small | 12px | 400 | Secondary labels, findings |
| Body | 14px | 400 | Perk names, list text |
| Subtitle | 16px | 600 | Section headers |
| Title | 18px | 600 | Screen titles |
| Heading | 24px | 700 | Login hero |

**Destiny headers** (socket categories, uppercase labels): Helvetica/Arial, 600 weight, uppercase — matches DIM `@mixin destiny-header`.

**UI font:** Inter (web/mobile). Fallback: system sans-serif.

---

## Spacing & grid

**Base unit:** 4px.

| Token | px |
|-------|-----|
| `spacing.1` | 4 |
| `spacing.2` | 8 |
| `spacing.3` | 12 |
| `spacing.4` | 16 |
| `spacing.6` | 24 |

### Item grid (inventory)

| Property | Value | Reference |
|----------|-------|-----------|
| Tile size | **50px** | DIM `--item-size: 50px` |
| Tile gap | 8px | DIM `--item-margin` |
| Compact tile | 40px | Mod lists, dense views |
| Row height (list mode) | 56px | Alternative to grid |

Grid layout: flex wrap with consistent gaps — DIM does not use huge whitespace between items.

### Layout

| Property | Value |
|----------|-------|
| Header height | 48px |
| Search bar height | 28px |
| Sidebar (optional) | 280px |
| Max content width | 1280px |

---

## Reference apps

### Destiny Item Manager

- Repo: https://github.com/DestinyItemManager/DIM
- Key files: `src/app/_variables.scss`, `src/app/themes/_theme-classic.scss`
- Patterns: 50px item tiles, black header, gray surfaces, gold brand, blue selection, uppercase socket headers, perk circles with blue fill when selected

### Ishtar Commander

- Repo: https://github.com/guardiangames/Ishtar-Commander
- Patterns: Mobile-first companion, emblem + character context, transfer-oriented layouts

Pin 2–3 screenshots per app in Figma **Tokens** page under a **References** frame.

---

## Token → code mapping (LEE-72)

| Design token file | Code target |
|-------------------|-------------|
| `design/tokens/design-tokens.json` | `packages/ui/src/theme/theme.ts` |
| Figma variables | Visual QA against components |

Run validation after editing tokens:

```bash
pnpm validate-design-tokens
```

---

## Milestone tickets

| Ticket | Scope |
|--------|-------|
| **LEE-70** | This doc + token JSON + Figma structure |
| LEE-71 | High-fidelity screen mocks in Figma |
| LEE-72 | Implement tokens in `packages/ui` |
| LEE-73 | Redesign components |
| LEE-74 | Apply to web screens |
