import { describe, expect, it } from "vitest";

import { createGodRollDefinitions, godRollDefinitions, godRollEntries } from "./definitions.js";
import type { GodRollEntry } from "./schema.js";

describe("createGodRollDefinitions", () => {
  it("flattens curated entries into core god roll definitions", () => {
    const definitions = createGodRollDefinitions([
      {
        weaponHash: 123,
        weaponName: "Test Weapon",
        rolls: [
          {
            mode: "pvp",
            label: "Dueling",
            perks: {
              barrel: ["Smallbore"],
              magazine: ["Accurized Rounds"],
              perk1: ["Kill Clip"],
              perk2: ["Firefly"],
            },
            flexSlots: ["perk2"],
          },
          {
            mode: "pve",
            label: "Add-clear",
            perks: {
              perk1: ["Explosive Payload"],
              originTrait: ["Hot Swap"],
            },
            flexSlots: ["originTrait"],
          },
        ],
      },
    ] satisfies GodRollEntry[]);

    expect(definitions).toEqual([
      {
        weaponHash: 123,
        mode: "pvp",
        label: "Dueling",
        slots: {
          barrel: ["Smallbore"],
          magazine: ["Accurized Rounds"],
          perk1: ["Kill Clip"],
          perk2: ["Firefly"],
        },
        flexSlots: [{ slot: "perk2", perks: ["Firefly"] }],
      },
      {
        weaponHash: 123,
        mode: "pve",
        label: "Add-clear",
        slots: {
          perk1: ["Explosive Payload"],
        },
        flexSlots: [],
      },
    ]);
  });
});

describe("godRollDefinitions", () => {
  it("exports one core definition for every curated roll", () => {
    const curatedRollCount = godRollEntries.reduce((count, entry) => count + entry.rolls.length, 0);

    expect(godRollDefinitions).toHaveLength(curatedRollCount);
    expect(godRollDefinitions).toContainEqual(
      expect.objectContaining({
        weaponHash: 4219826183,
        mode: "pve",
        label: "Add-clear",
      }),
    );
    expect(
      godRollDefinitions.every(
        (definition) => definition.mode === "pvp" || definition.mode === "pve",
      ),
    ).toBe(true);
  });
});
