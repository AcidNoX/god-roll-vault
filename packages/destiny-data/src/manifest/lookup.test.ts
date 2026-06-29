import { describe, expect, it } from "vitest";

import { isWeaponBucket, WEAPON_BUCKET_HASHES } from "../buckets.js";
import { getPerkName, getWeaponDefinition, getWeaponName, getWeaponTier } from "./lookup.js";
import mvpPlugs from "./mvp-plugs.json";
import mvpWeapons from "./mvp-weapons.json";

describe("manifest lookup", () => {
  it("includes at least 50 curated weapons and 25 perks", () => {
    expect(Object.keys(mvpWeapons).length).toBeGreaterThanOrEqual(50);
    expect(Object.keys(mvpPlugs).length).toBeGreaterThanOrEqual(25);
  });

  it("resolves known weapon and perk hashes", () => {
    expect(getWeaponDefinition(1363886209)).toEqual({
      name: "Fatebringer (Timelost)",
      tier: "Legendary",
    });
    expect(getWeaponName(1363886209)).toBe("Fatebringer (Timelost)");
    expect(getWeaponTier(1363886209)).toBe("Legendary");
    expect(getWeaponName(347366834)).toBe("Ace of Spades");
    expect(getWeaponTier(347366834)).toBe("Exotic");
    expect(getPerkName(1467527085)).toBe("Firefly");
    expect(getPerkName(1015611457)).toBe("Kill Clip");
  });

  it("preserves LEE-38 fixture weapon names", () => {
    expect(getWeaponName(2595497736)).toBe("Crafted Test Rifle");
    expect(getWeaponName(3687335430)).toBe("Vault Test Shotgun");
  });

  it("preserves LEE-38 fixture perk names", () => {
    expect(getPerkName(3177301540)).toBe("Explosive Payload");
    expect(getPerkName(1820237385)).toBe("Fourth Times the Charm");
    expect(getPerkName(1710791522)).toBe("Rampage");
    expect(getPerkName(2847525152)).toBe("Accurized Rounds");
  });

  it("falls back for unknown hashes", () => {
    expect(getWeaponName(999)).toBe("Unknown Weapon (999)");
    expect(getWeaponTier(999)).toBe("Unknown");
    expect(getPerkName(999)).toBe("Unknown Perk (999)");
  });
});

describe("isWeaponBucket", () => {
  it("identifies weapon inventory buckets", () => {
    for (const bucketHash of WEAPON_BUCKET_HASHES) {
      expect(isWeaponBucket(bucketHash)).toBe(true);
    }
    expect(isWeaponBucket(3448274439)).toBe(false);
  });
});
