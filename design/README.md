# Design assets

Source-of-truth design tokens for God Roll Vault (DIM / Ishtar Commander aesthetic).

| Asset | Purpose |
|-------|---------|
| [Figma file](https://www.figma.com/design/wxhNTKhoNRnnRP3MQsmrwq/Untitled) | Visual specs, components, screen mocks |
| `tokens/design-tokens.json` | Canonical token values (LEE-70) |
| `tokens/figma-tokens.json` | [Tokens Studio](https://tokens.studio/) / Figma Variables import format |
| [docs/design-system.md](../docs/design-system.md) | Full design system documentation |
| `screens/screens.json` | Screen mock specs (LEE-71) |
| `previews/` | Static HTML screen previews at 1280px |
| [docs/design-screens.md](../docs/design-screens.md) | Figma Screens page build guide |

## Import tokens into Figma

1. Install the **Tokens Studio for Figma** plugin (or use Figma Variables manually).
2. Import `design/tokens/figma-tokens.json`.
3. Create pages: **Tokens**, **Components**, **Screens** (see `docs/design-system.md`).
4. Map token collections to Figma variables per the doc.

## Validate tokens

```bash
pnpm validate-design-tokens
```

## Screen previews (LEE-71)

Open `design/previews/index.html` in a browser, then screenshot into Figma **Screens** page. See [docs/design-screens.md](../docs/design-screens.md).

```bash
pnpm validate-design-screens
```
