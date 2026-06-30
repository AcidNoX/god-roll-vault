# Screen mocks (LEE-71)

High-fidelity screen specifications and static HTML previews for the God Roll Vault web app. Use these to build the **Screens** page in Figma and as implementation reference for LEE-74.

**Figma:** https://www.figma.com/design/wxhNTKhoNRnnRP3MQsmrwq/Untitled  
**Machine-readable spec:** `design/screens/screens.json`  
**Static previews:** `design/previews/` (open `index.html` in a browser)

---

## Quick start

1. Open `design/previews/index.html` locally (or serve the `design/previews` folder).
2. Screenshot each screen at **1280px** width for desktop Figma frames.
3. Resize the browser to **390px** (or use DevTools device mode) for mobile frames.
4. Place frames on the Figma **Screens** page using names from `screens.json` → `figmaFrame.name`.

```bash
pnpm validate-design-screens
```

---

## Figma Screens page layout

Create one frame per entry in `screens.json`. Suggested desktop artboard sizes:

| Frame name | Source preview | Size |
|------------|----------------|------|
| Login / Desktop | `login.html` | 1280 × 800 |
| Login / Mobile | `login.html` @ 390px | 390 × 844 |
| App shell + Inventory / Desktop | `inventory.html` | 1280 × 900 |
| Inventory / Mobile | `inventory.html` @ 390px | 390 × 844 |
| Weapon detail / Desktop | `weapon-detail.html` | 1280 × 900 |
| Weapon detail / Mobile | `weapon-detail.html` @ 390px | 390 × 844 |
| Settings / Desktop | `settings.html` | 1280 × 800 |

Bind colors and spacing to Figma variables imported from LEE-70 tokens.

---

## Screen breakdown

### Login (`/login`)

- Centered card on `color.app.background` (`#313233`).
- Primary CTA: **Sign in with Bungie** using `color.brand.primary`.
- **States:** default, config-error (inline banner above button), loading (disabled button).

### App shell (header on inventory + detail)

Shared chrome across authenticated routes:

| Region | Token / size |
|--------|----------------|
| Header bar | `color.app.header`, 48px height |
| Logo | Brand gold wordmark |
| Search | `size.searchBarHeight` (28px) |
| Mode toggle | PVP / PVE segmented control |
| Character emblem | 237 × 48 (Destiny aspect) |
| Settings | Icon button → settings screen |

### Inventory (`/inventory`)

- Toolbar: character name, power, item count, Refresh, Change character.
- Weapon grid: **50 × 50** tiles, **8px** gap (`size.itemTile`, `spacing.gridGap`).
- God roll badge: top-right corner — perfect (gold), partial (silver), missing (red).
- **States:** default, loading, empty, error, hover tile (blue border), selected tile (2px outline).

### Weapon detail (`/weapons/:itemInstanceId`)

- Desktop: grid dimmed left, **420px** detail panel right.
- Large item tile (64px), perk rows with match/miss styling, target roll block.
- PVP/PVE toggle updates badge label and target roll copy.
- Mobile ≤540px: single column — panel stacks below grid.

### Settings

- Section cards on `color.app.backgroundDeep` (`#222`).
- Account row (membership id), default game mode, sign-out (destructive border, not filled red).

---

## Interaction annotations

Document these on Figma frames (also in `screens.json` → `annotations`):

| State | Behavior |
|-------|----------|
| Hover | Tile border → `color.border.focus` (`#4887ba`) |
| Selected | 2px outline `color.border.focus` |
| Loading | Spinner or skeleton grid on app background |
| Empty | Centered empty state in content area |
| Error | Error state with retry; primary CTA in brand gold |

---

## Mobile breakpoint (540px)

DIM uses `phone-portrait` at 540px. Previews include responsive rules in `shared.css`:

- Header wraps; search goes full width.
- Character emblem hidden on narrow viewports.
- Detail layout becomes single column.

---

## Web route mapping

| Route | Screen spec |
|-------|-------------|
| `/login` | `login` |
| `/inventory` | `app-shell` + `inventory` |
| `/weapons/:itemInstanceId` | `app-shell` + `weapon-detail` |
| `/characters` | Character picker (future; use inventory toolbar “Change character” as reference) |
| Settings (planned) | `settings` |

---

## Milestone tickets

| Ticket | Scope |
|--------|-------|
| LEE-70 | Design tokens + Figma structure |
| **LEE-71** | This doc + `screens.json` + HTML previews |
| LEE-72 | Implement tokens in `packages/ui` |
| LEE-73 | Redesign components |
| LEE-74 | Apply mocks to web screens |
