import { describe, expect, it } from "vitest";

import { isWeaponBucket, WEAPON_BUCKET_HASHES } from "../buckets.js";
import {
  getBungieAssetUrl,
  getPerkIconUrl,
  getPerkName,
  getWeaponDefinition,
  getWeaponIconUrl,
  getWeaponName,
  getWeaponTier,
} from "./lookup.js";
import mvpPlugs from "./mvp-plugs.json";
import mvpWeapons from "./mvp-weapons.json";

describe("manifest lookup", () => {
  it("includes at least 50 curated weapons and 25 perks", () => {
    expect(Object.keys(mvpWeapons).length).toBeGreaterThanOrEqual(50);
    expect(Object.keys(mvpPlugs).length).toBeGreaterThanOrEqual(25);
  });

  it("resolves known weapon and perk hashes", () => {
    expect(getWeaponDefinition(1363886209)).toMatchObject({
      name: "Fatebringer (Timelost)",
      tier: "Legendary",
    });
    expect(getWeaponDefinition(1363886209)?.iconPath).toMatch(
      /^\/common\/destiny2_content\/icons\//,
    );
    expect(getWeaponName(1363886209)).toBe("Fatebringer (Timelost)");
    expect(getWeaponTier(1363886209)).toBe("Legendary");
    expect(getWeaponName(347366834)).toBe("Ace of Spades");
    expect(getWeaponTier(347366834)).toBe("Exotic");
    expect(getPerkName(1467527085)).toBe("Firefly");
    expect(getPerkName(1015611457)).toBe("Kill Clip");
  });

  it("resolves Bungie asset URLs for manifest entries with icons", () => {
    expect(getWeaponIconUrl(4219826183)).toBe(
      "https://www.bungie.net/common/destiny2_content/icons/0e281ebb76f5e5ba169bd44c036fcf39.jpg",
    );
    expect(getPerkIconUrl(3038247973)).toBe(
      "https://www.bungie.net/common/destiny2_content/icons/31f02e5f3bae68ecdfdd3f899cf931c7.png",
    );
  });

  it("normalizes Bungie asset paths and leaves absolute URLs untouched", () => {
    expect(getBungieAssetUrl("common/example.png")).toBe(
      "https://www.bungie.net/common/example.png",
    );
    expect(getBungieAssetUrl("/common/example.png")).toBe(
      "https://www.bungie.net/common/example.png",
    );
    expect(getBungieAssetUrl("https://cdn.example/icon.png")).toBe("https://cdn.example/icon.png");
    expect(getBungieAssetUrl(undefined)).toBeUndefined();
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
    expect(getWeaponIconUrl(999)).toBeUndefined();
    expect(getPerkIconUrl(999)).toBeUndefined();
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
