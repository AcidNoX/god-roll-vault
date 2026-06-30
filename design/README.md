# Design assets

Source-of-truth design tokens for God Roll Vault (DIM / Ishtar Commander aesthetic).

| Asset | Purpose |
|-------|---------|
| [Figma file](https://www.figma.com/design/wxhNTKhoNRnnRP3MQsmrwq/Untitled) | Visual specs, components, screen mocks |
| `tokens/design-tokens.json` | Canonical token values (LEE-70) |
| `tokens/figma-tokens.json` | [Tokens Studio](https://tokens.studio/) / Figma Variables import format |
| [docs/design-system.md](../docs/design-system.md) | Full design system documentation |

## Import tokens into Figma

1. Install the **Tokens Studio for Figma** plugin (or use Figma Variables manually).
2. Import `design/tokens/figma-tokens.json`.
3. Create pages: **Tokens**, **Components**, **Screens** (see `docs/design-system.md`).
4. Map token collections to Figma variables per the doc.

## Validate tokens

```bash
pnpm validate-design-tokens
```
