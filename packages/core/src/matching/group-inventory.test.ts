import { describe, expect, it } from "vitest";

import type { GodRollDefinition } from "../types/god-roll.js";
import type { InventoryWeapon } from "../types/inventory.js";
import { groupInventoryByWeapon } from "./group-inventory.js";

const FATEBRINGER_HASH = 4219826183;

function makeWeapon(overrides: Partial<InventoryWeapon> = {}): InventoryWeapon {
  return {
    itemHash: FATEBRINGER_HASH,
    itemInstanceId: "fatebringer-a",
    name: "Fatebringer (Timelost)",
    tier: "Legendary",
    power: 1800,
    element: "kinetic",
    perks: [],
    location: "character",
    bucketHash: 1498876634,
    isEquipped: false,
    ...overrides,
  };
}

const fatebringerGodRoll: GodRollDefinition = {
  weaponHash: FATEBRINGER_HASH,
  mode: "pvp",
  label: "Dueling",
  slots: {
    barrel: ["Smallbore"],
    magazine: ["Accurized Rounds"],
    perk1: ["Kill Clip"],
    perk2: ["Firefly"],
  },
};

describe("groupInventoryByWeapon", () => {
  it("returns a single only copy when there are no duplicates", () => {
    const weapons = [
      makeWeapon({
        itemInstanceId: "solo",
        perks: [
          { plugHash: 1, name: "Smallbore" },
          { plugHash: 2, name: "Accurized Rounds" },
          { plugHash: 3, name: "Kill Clip" },
          { plugHash: 4, name: "Firefly" },
        ],
      }),
    ];

    const groups = groupInventoryByWeapon(weapons, [fatebringerGodRoll], "pvp");

    expect(groups).toHaveLength(1);
    expect(groups[0]?.copyCount).toBe(1);
    expect(groups[0]?.instances[0]?.disposition).toBe("only");
    expect(groups[0]?.keeper.weapon.itemInstanceId).toBe("solo");
    expect(groups[0]?.keeper.result.status).toBe("perfect");
  });

  it("ranks duplicate copies and recommends dismantling worse rolls", () => {
    const weapons = [
      makeWeapon({
        itemInstanceId: "fatebringer-worse",
        power: 1810,
        perks: [
          { plugHash: 1, name: "Corkscrew Rifling" },
          { plugHash: 2, name: "Accurized Rounds" },
          { plugHash: 3, name: "Kill Clip" },
          { plugHash: 4, name: "Opening Shot" },
        ],
      }),
      makeWeapon({
        itemInstanceId: "fatebringer-best",
        power: 1805,
        perks: [
          { plugHash: 1, name: "Smallbore" },
          { plugHash: 2, name: "Accurized Rounds" },
          { plugHash: 3, name: "Kill Clip" },
          { plugHash: 4, name: "Firefly" },
        ],
      }),
      makeWeapon({
        itemInstanceId: "fatebringer-mid",
        power: 1800,
        perks: [
          { plugHash: 1, name: "Corkscrew Rifling" },
          { plugHash: 2, name: "Accurized Rounds" },
          { plugHash: 3, name: "Kill Clip" },
          { plugHash: 4, name: "Firefly" },
        ],
      }),
    ];

    const groups = groupInventoryByWeapon(weapons, [fatebringerGodRoll], "pvp");

    expect(groups).toHaveLength(1);
    expect(groups[0]?.copyCount).toBe(3);
    expect(groups[0]?.keeper.weapon.itemInstanceId).toBe("fatebringer-best");
    expect(groups[0]?.keeper.result.status).toBe("perfect");
    expect(groups[0]?.instances.map((instance) => instance.disposition)).toEqual([
      "keep",
      "dismantle",
      "dismantle",
    ]);
  });

  it("marks non-keepers for dismantle when the keeper is already a god roll", () => {
    const weapons = [
      makeWeapon({
        itemInstanceId: "god-roll",
        perks: [
          { plugHash: 1, name: "Smallbore" },
          { plugHash: 2, name: "Accurized Rounds" },
          { plugHash: 3, name: "Kill Clip" },
          { plugHash: 4, name: "Firefly" },
        ],
      }),
      makeWeapon({
        itemInstanceId: "almost",
        perks: [
          { plugHash: 1, name: "Corkscrew Rifling" },
          { plugHash: 2, name: "Accurized Rounds" },
          { plugHash: 3, name: "Kill Clip" },
          { plugHash: 4, name: "Firefly" },
        ],
      }),
    ];

    const groups = groupInventoryByWeapon(weapons, [fatebringerGodRoll], "pvp");

    expect(groups[0]?.instances[1]?.disposition).toBe("dismantle");
  });

  it("groups different weapon archetypes separately", () => {
    const weapons = [
      makeWeapon({ itemInstanceId: "fb-1" }),
      makeWeapon({
        itemInstanceId: "palindrome-1",
        itemHash: 1481892490,
        name: "The Palindrome",
      }),
    ];

    const groups = groupInventoryByWeapon(weapons, [fatebringerGodRoll], "pvp");

    expect(groups).toHaveLength(2);
    expect(groups.map((group) => group.itemHash).sort()).toEqual([1481892490, FATEBRINGER_HASH]);
  });

  it("surfaces duplicate-heavy groups before single-copy weapons", () => {
    const weapons = [
      makeWeapon({ itemInstanceId: "fb-1" }),
      makeWeapon({ itemInstanceId: "fb-2", itemHash: FATEBRINGER_HASH }),
      makeWeapon({
        itemInstanceId: "palindrome-1",
        itemHash: 1481892490,
        name: "The Palindrome",
      }),
    ];

    const groups = groupInventoryByWeapon(weapons, [fatebringerGodRoll], "pvp");

    expect(groups[0]?.copyCount).toBe(2);
    expect(groups[0]?.itemHash).toBe(FATEBRINGER_HASH);
  });
});
