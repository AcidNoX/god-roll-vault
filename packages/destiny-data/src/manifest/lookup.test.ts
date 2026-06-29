import { describe, expect, it } from "vitest";

import { isWeaponBucket, WEAPON_BUCKET_HASHES } from "../buckets.js";
import { getPerkName, getWeaponDefinition, getWeaponName, getWeaponTier } from "./lookup.js";

describe("manifest lookup", () => {
  it("resolves known weapon and perk hashes", () => {
    expect(getWeaponDefinition(1363886209)).toEqual({
      name: "Fatebringer (Timelost)",
      tier: "Legendary",
    });
    expect(getWeaponName(1363886209)).toBe("Fatebringer (Timelost)");
    expect(getWeaponTier(1363886209)).toBe("Legendary");
    expect(getPerkName(1467527085)).toBe("Firefly");
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
