import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const screensPath = resolve(import.meta.dirname, "../../../../design/screens/screens.json");
const screens = JSON.parse(readFileSync(screensPath, "utf8")) as {
  meta: { figma: string; desktopWidth: number; mobileBreakpoint: number };
  screens: Array<{ id: string; figmaFrame: { name: string } }>;
  annotations: Record<string, string>;
};

describe("design screens (LEE-71)", () => {
  it("defines five core screen specs", () => {
    const ids = screens.screens.map((s) => s.id).sort();
    expect(ids).toEqual(["app-shell", "inventory", "login", "settings", "weapon-detail"]);
  });

  it("uses 1280px desktop artboards", () => {
    expect(screens.meta.desktopWidth).toBe(1280);
    expect(screens.meta.mobileBreakpoint).toBe(540);
  });

  it("links to the Figma file", () => {
    expect(screens.meta.figma).toContain("figma.com/design/wxhNTKhoNRnnRP3MQsmrwq");
  });

  it("documents interaction annotations", () => {
    expect(screens.annotations.hover).toContain("border");
    expect(screens.annotations.selected).toBeDefined();
    expect(screens.annotations.loading).toBeDefined();
  });
});
