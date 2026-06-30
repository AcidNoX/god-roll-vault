import { describe, expect, it } from "vitest";
import { buildInventoryPreviewData } from "./generate-inventory-preview.js";
import { PREVIEW_SELECTED_INSTANCE_ID } from "./inventory-fixture.js";

const FATEBRINGER_HASH = 4219826183;

describe("buildInventoryPreviewData", () => {
  it("groups weapons into kinetic, energy, and power sections", () => {
    const data = buildInventoryPreviewData();

    expect(data.sections.map((section) => section.key)).toEqual(["kinetic", "energy", "power"]);
    expect(data.sections[0]?.groups.length).toBeGreaterThan(0);
    expect(data.sections[1]?.groups.length).toBeGreaterThan(0);
    expect(data.sections[2]?.groups.length).toBeGreaterThan(0);
  });

  it("uses Bungie icon URLs when manifest paths exist", () => {
    const data = buildInventoryPreviewData();
    const fatebringerGroup = data.sections[0]?.groups.find(
      (group) => group.itemHash === FATEBRINGER_HASH,
    );

    expect(fatebringerGroup?.keeper.iconUrl).toMatch(/^https:\/\/www\.bungie\.net\//);
  });

  it("ranks duplicate Fatebringer copies with a recommended keeper", () => {
    const data = buildInventoryPreviewData();
    const fatebringerGroup = data.sections[0]?.groups.find(
      (group) => group.itemHash === FATEBRINGER_HASH,
    );

    expect(fatebringerGroup?.copyCount).toBe(3);
    expect(fatebringerGroup?.dispositionSummary).toContain("keep 1");
    expect(fatebringerGroup?.dispositionSummary).toContain("dismantle 2");
    expect(fatebringerGroup?.keeper.itemInstanceId).toBe("preview-fatebringer-keeper");
    expect(fatebringerGroup?.keeper.matchStatus).toBe("perfect");
  });

  it("evaluates the selected Fatebringer copy as a partial PVP roll", () => {
    const data = buildInventoryPreviewData();

    expect(data.detail.weapon.name).toContain("Fatebringer");
    expect(data.detail.weapon.itemInstanceId).toBe(PREVIEW_SELECTED_INSTANCE_ID);
    expect(data.detail.weapon.matchStatus).toBe("partial");
    expect(data.detail.keeperInstanceId).toBe("preview-fatebringer-keeper");
    expect(data.detail.duplicateCopies).toHaveLength(3);
    expect(data.detail.verdict.matched).toBe(3);
    expect(data.detail.verdict.total).toBe(4);
    expect(data.detail.perkRows.find((row) => row.slot === "barrel")?.matched).toBe(false);
  });

  it("includes inventory summary counts for duplicate decisions", () => {
    const data = buildInventoryPreviewData();

    expect(data.summary.weaponGroups).toBeGreaterThan(0);
    expect(data.summary.duplicateGroups).toBeGreaterThanOrEqual(1);
    expect(data.summary.dismantleCandidates).toBeGreaterThanOrEqual(2);
  });

  it("includes perk icons for the selected weapon detail rows", () => {
    const data = buildInventoryPreviewData();
    const firefly = data.detail.perkRows.find((row) => row.slot === "perk2");

    expect(firefly?.yours?.name).toBe("Firefly");
    expect(firefly?.yours?.iconUrl).toMatch(/^https:\/\/www\.bungie\.net\//);
  });
});
