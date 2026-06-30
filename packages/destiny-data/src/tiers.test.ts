import { describe, expect, it } from "vitest";

import {
  BUNGIE_TIER_TYPE,
  getTierBackgroundColor,
  getTierDiamondCount,
  mapBungieTierType,
  mapTierNameToType,
} from "./tiers.js";

describe("weapon tier helpers", () => {
  it("maps Bungie tier types", () => {
    expect(mapBungieTierType(BUNGIE_TIER_TYPE.legendary)).toBe("legendary");
    expect(mapBungieTierType(BUNGIE_TIER_TYPE.exotic)).toBe("exotic");
    expect(mapTierNameToType("Legendary")).toBe("legendary");
  });

  it("returns DIM-style diamond counts", () => {
    expect(getTierDiamondCount("legendary")).toBe(4);
    expect(getTierDiamondCount("rare")).toBe(3);
    expect(getTierDiamondCount("exotic")).toBe(0);
  });

  it("returns tier background colors", () => {
    expect(getTierBackgroundColor("legendary")).toBe("#522f65");
    expect(getTierBackgroundColor("exotic")).toBe("#ceae33");
  });
});
