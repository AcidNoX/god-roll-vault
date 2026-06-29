import { describe, expect, it } from "vitest";

import { godRollEntrySchema, godRollPerksSchema, godRollRollSchema } from "./schema.js";

const validEntry = {
  weaponHash: 1481892490,
  weaponName: "The Palindrome (Adept)",
  rolls: [
    {
      mode: "pvp",
      label: "Dueling",
      perks: {
        barrel: ["Arrowhead Brake"],
        magazine: ["Accurized Rounds"],
        perk1: ["Kill Clip"],
        perk2: ["Rampage"],
      },
      flexSlots: ["magazine"],
    },
  ],
};

describe("godRollEntrySchema", () => {
  it("parses a valid god roll entry", () => {
    expect(godRollEntrySchema.parse(validEntry)).toEqual(validEntry);
  });

  it("rejects invalid game mode", () => {
    const invalid = {
      ...validEntry,
      rolls: [{ ...validEntry.rolls[0], mode: "raid" }],
    };

    expect(() => godRollEntrySchema.parse(invalid)).toThrow(/Invalid enum value/);
  });

  it("rejects empty rolls array", () => {
    expect(() => godRollEntrySchema.parse({ ...validEntry, rolls: [] })).toThrow();
  });

  it("rejects empty perk option lists", () => {
    const roll = validEntry.rolls[0];
    if (!roll) {
      throw new Error("missing fixture roll");
    }

    const invalid = {
      ...validEntry,
      rolls: [
        {
          ...roll,
          perks: { ...roll.perks, barrel: [] },
        },
      ],
    };

    expect(() => godRollEntrySchema.parse(invalid)).toThrow();
  });

  it("rejects flexSlots that are not defined perk columns", () => {
    const invalid = {
      ...validEntry,
      rolls: [{ ...validEntry.rolls[0], flexSlots: ["perk3"] }],
    };

    const result = godRollEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toContain('flexSlots entry "perk3"');
    }
  });
});

describe("godRollPerksSchema", () => {
  it("requires at least one perk slot", () => {
    expect(() => godRollPerksSchema.parse({})).toThrow(/At least one perk slot/);
  });
});

describe("godRollRollSchema", () => {
  it("defaults flexSlots to an empty array", () => {
    const roll = validEntry.rolls[0];
    if (!roll) {
      throw new Error("missing fixture roll");
    }

    const { flexSlots: _flexSlots, ...withoutFlex } = roll;
    expect(godRollRollSchema.parse(withoutFlex).flexSlots).toEqual([]);
  });
});
