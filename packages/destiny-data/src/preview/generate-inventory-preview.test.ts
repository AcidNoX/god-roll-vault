import { describe, expect, it } from "vitest";
import { buildInventoryPreviewData } from "./generate-inventory-preview.js";
import { PREVIEW_SELECTED_INSTANCE_ID } from "./inventory-fixture.js";

describe("buildInventoryPreviewData", () => {
  it("groups weapons into kinetic, energy, and power sections", () => {
    const data = buildInventoryPreviewData();

    expect(data.sections.map((section) => section.key)).toEqual(["kinetic", "energy", "power"]);
    expect(data.sections[0]?.weapons.length).toBeGreaterThan(0);
    expect(data.sections[1]?.weapons.length).toBeGreaterThan(0);
    expect(data.sections[2]?.weapons.length).toBeGreaterThan(0);
  });

  it("uses Bungie icon URLs when manifest paths exist", () => {
    const data = buildInventoryPreviewData();
    const fatebringer = data.sections[0]?.weapons.find(
      (weapon) => weapon.itemInstanceId === PREVIEW_SELECTED_INSTANCE_ID,
    );

    expect(fatebringer?.iconUrl).toMatch(/^https:\/\/www\.bungie\.net\//);
  });

  it("evaluates Fatebringer as a partial PVP roll (barrel miss)", () => {
    const data = buildInventoryPreviewData();

    expect(data.detail.weapon.name).toContain("Fatebringer");
    expect(data.detail.weapon.matchStatus).toBe("partial");
    expect(data.detail.verdict.matched).toBe(3);
    expect(data.detail.verdict.total).toBe(4);
    expect(data.detail.perkRows.find((row) => row.slot === "barrel")?.matched).toBe(false);
  });

  it("includes perk icons for the selected weapon detail rows", () => {
    const data = buildInventoryPreviewData();
    const firefly = data.detail.perkRows.find((row) => row.slot === "perk2");

    expect(firefly?.yours?.name).toBe("Firefly");
    expect(firefly?.yours?.iconUrl).toMatch(/^https:\/\/www\.bungie\.net\//);
  });
});
