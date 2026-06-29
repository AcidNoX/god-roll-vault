import { describe, expect, it } from "vitest";

import type { GodRollDefinition } from "../types/god-roll.js";
import type { InventoryWeapon } from "../types/inventory.js";
import { evaluateInventory, findBestRoll, matchGodRoll } from "./match-god-roll.js";
import { perkNamesMatch } from "./perk-names.js";

const WEAPON_HASH = 3184068932;

function makeWeapon(overrides: Partial<InventoryWeapon> = {}): InventoryWeapon {
  return {
    itemHash: WEAPON_HASH,
    itemInstanceId: "instance-1",
    name: "Test Hand Cannon",
    tier: "Legendary",
    power: 1800,
    perks: [],
    location: "vault",
    bucketHash: 1498876634,
    isEquipped: false,
    ...overrides,
  };
}

function makeGodRoll(overrides: Partial<GodRollDefinition> = {}): GodRollDefinition {
  return {
    weaponHash: WEAPON_HASH,
    mode: "pvp",
    slots: {
      barrel: ["Arrowhead Brake"],
      magazine: ["Ricochet Rounds"],
      perk1: ["Kill Clip"],
      perk2: ["Rampage"],
    },
    ...overrides,
  };
}

describe("perkNamesMatch", () => {
  it("matches case-insensitively", () => {
    expect(perkNamesMatch("rampage", "Rampage")).toBe(true);
  });

  it("matches enhanced perk names to base names", () => {
    expect(perkNamesMatch("Enhanced Rampage", "Rampage")).toBe(true);
  });
});

describe("matchGodRoll", () => {
  it("returns perfect match with score 100 when all perks match", () => {
    const weapon = makeWeapon({
      perks: [
        { plugHash: 1, name: "Arrowhead Brake" },
        { plugHash: 2, name: "Ricochet Rounds" },
        { plugHash: 3, name: "Kill Clip" },
        { plugHash: 4, name: "Rampage" },
      ],
    });

    const result = matchGodRoll(weapon, makeGodRoll(), "pvp");

    expect(result.status).toBe("perfect");
    expect(result.score).toBe(100);
    expect(result.matchedPerks).toHaveLength(4);
    expect(result.missingPerks).toHaveLength(0);
  });

  it("returns partial match when 3 of 4 perks match", () => {
    const weapon = makeWeapon({
      perks: [
        { plugHash: 1, name: "Arrowhead Brake" },
        { plugHash: 2, name: "Ricochet Rounds" },
        { plugHash: 3, name: "Kill Clip" },
        { plugHash: 4, name: "Explosive Payload" },
      ],
    });

    const result = matchGodRoll(weapon, makeGodRoll(), "pvp");

    expect(result.status).toBe("partial");
    expect(result.score).toBe(75);
    expect(result.matchedPerks).toHaveLength(3);
    expect(result.missingPerks).toHaveLength(1);
    expect(result.missingPerks[0]?.slot).toBe("perk2");
  });

  it("returns unknown when weapon hash does not match", () => {
    const weapon = makeWeapon({ itemHash: 9999999999 });
    const result = matchGodRoll(weapon, makeGodRoll(), "pvp");

    expect(result.status).toBe("unknown");
    expect(result.score).toBe(0);
    expect(result.details).toHaveLength(0);
  });

  it("treats flex slot alternate perks as perfect", () => {
    const weapon = makeWeapon({
      perks: [
        { plugHash: 1, name: "Corkscrew Rifling" },
        { plugHash: 2, name: "Ricochet Rounds" },
        { plugHash: 3, name: "Kill Clip" },
        { plugHash: 4, name: "Rampage" },
      ],
    });

    const godRoll = makeGodRoll({
      flexSlots: [{ slot: "barrel", perks: ["Corkscrew Rifling", "Fluted Barrel"] }],
    });

    const result = matchGodRoll(weapon, godRoll, "pvp");

    expect(result.status).toBe("perfect");
    expect(result.score).toBe(100);
    expect(result.matchedPerks.find((detail) => detail.slot === "barrel")?.matchedPerkName).toBe(
      "Corkscrew Rifling",
    );
  });

  it("does not penalize extra origin trait perks", () => {
    const weapon = makeWeapon({
      perks: [
        { plugHash: 1, name: "Arrowhead Brake" },
        { plugHash: 2, name: "Ricochet Rounds" },
        { plugHash: 3, name: "Kill Clip" },
        { plugHash: 4, name: "Rampage" },
        { plugHash: 5, name: "Blind Ambition" },
      ],
    });

    const result = matchGodRoll(weapon, makeGodRoll(), "pvp");

    expect(result.status).toBe("perfect");
    expect(result.score).toBe(100);
  });

  it("matches crafted enhanced perk names", () => {
    const weapon = makeWeapon({
      perks: [
        { plugHash: 1, name: "Arrowhead Brake" },
        { plugHash: 2, name: "Ricochet Rounds" },
        { plugHash: 3, name: "Enhanced Kill Clip" },
        { plugHash: 4, name: "Enhanced Rampage" },
      ],
    });

    const result = matchGodRoll(weapon, makeGodRoll(), "pvp");

    expect(result.status).toBe("perfect");
    expect(result.score).toBe(100);
  });
});

describe("findBestRoll", () => {
  it("returns the highest-scoring variant for a weapon", () => {
    const weapon = makeWeapon({
      perks: [
        { plugHash: 1, name: "Arrowhead Brake" },
        { plugHash: 2, name: "Ricochet Rounds" },
        { plugHash: 3, name: "Kill Clip" },
        { plugHash: 4, name: "Explosive Payload" },
      ],
    });

    const partialRoll = makeGodRoll({ label: "dueling" });
    const worseRoll = makeGodRoll({
      label: "off-meta",
      slots: {
        barrel: ["Fluted Barrel"],
        magazine: ["Accurized Rounds"],
        perk1: ["Opening Shot"],
        perk2: ["Explosive Payload"],
      },
    });

    const result = findBestRoll(weapon, [worseRoll, partialRoll], "pvp");

    expect(result.score).toBe(75);
    expect(result.status).toBe("partial");
  });
});

describe("evaluateInventory", () => {
  it("evaluates each weapon in batch", () => {
    const weapons = [
      makeWeapon({ itemInstanceId: "a" }),
      makeWeapon({
        itemInstanceId: "b",
        itemHash: 4124984448,
        perks: [{ plugHash: 1, name: "Subsistence" }],
      }),
    ];

    const godRolls = [
      makeGodRoll(),
      makeGodRoll({
        weaponHash: 4124984448,
        mode: "pvp",
        slots: { perk1: ["Subsistence"] },
      }),
    ];

    const evaluations = evaluateInventory(weapons, godRolls, "pvp");

    expect(evaluations).toHaveLength(2);
    expect(evaluations[0]?.result.status).toBe("missing");
    expect(evaluations[1]?.result.status).toBe("perfect");
  });
});
