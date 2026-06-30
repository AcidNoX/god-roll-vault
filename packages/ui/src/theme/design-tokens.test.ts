import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const tokensPath = resolve(import.meta.dirname, "../../../../design/tokens/design-tokens.json");
const tokens = JSON.parse(readFileSync(tokensPath, "utf8")) as {
  color: { godRoll: Record<string, { border: string }>; rarity: Record<string, string> };
  size: { itemTile: number };
  meta: { figma: string };
};

describe("design tokens (LEE-70)", () => {
  it("defines DIM-aligned item tile size", () => {
    expect(tokens.size.itemTile).toBe(50);
  });

  it("defines all god roll status colors", () => {
    expect(Object.keys(tokens.color.godRoll).sort()).toEqual([
      "missing",
      "partial",
      "perfect",
      "unknown",
    ]);
  });

  it("defines Bungie rarity tier colors", () => {
    expect(tokens.color.rarity.exotic).toBe("#c3a019");
    expect(tokens.color.rarity.legendary).toBe("#513065");
  });

  it("links to the Figma file", () => {
    expect(tokens.meta.figma).toContain("figma.com/design/wxhNTKhoNRnnRP3MQsmrwq");
  });
});
