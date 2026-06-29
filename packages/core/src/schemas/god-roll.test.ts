import { describe, expect, it } from "vitest";

import {
  gameModeSchema,
  godRollDefinitionSchema,
  godRollDefinitionsSchema,
  matchStatusSchema,
  weaponPerkSchema,
} from "./god-roll.js";

describe("gameModeSchema", () => {
  it("accepts pvp and pve", () => {
    expect(gameModeSchema.parse("pvp")).toBe("pvp");
    expect(gameModeSchema.parse("pve")).toBe("pve");
  });

  it("rejects invalid modes", () => {
    expect(() => gameModeSchema.parse("crucible")).toThrow();
  });
});

describe("matchStatusSchema", () => {
  it("accepts all match statuses", () => {
    for (const status of ["perfect", "partial", "missing", "unknown"] as const) {
      expect(matchStatusSchema.parse(status)).toBe(status);
    }
  });

  it("rejects invalid statuses", () => {
    expect(() => matchStatusSchema.parse("close-enough")).toThrow();
  });
});

describe("weaponPerkSchema", () => {
  it("parses a valid perk", () => {
    expect(weaponPerkSchema.parse({ plugHash: 123, name: "Outlaw" })).toEqual({
      plugHash: 123,
      name: "Outlaw",
    });
  });

  it("rejects missing fields", () => {
    expect(() => weaponPerkSchema.parse({ plugHash: 123 })).toThrow();
  });
});

describe("godRollDefinitionSchema", () => {
  const validDefinition = {
    weaponHash: 3184068932,
    mode: "pvp",
    perks: [
      { plugHash: 655892035, name: "Rampage" },
      { plugHash: 1745960977, name: "Outlaw" },
    ],
  };

  it("parses a valid god roll definition", () => {
    expect(godRollDefinitionSchema.parse(validDefinition)).toEqual(validDefinition);
  });

  it("rejects invalid mode", () => {
    expect(() => godRollDefinitionSchema.parse({ ...validDefinition, mode: "raid" })).toThrow();
  });

  it("rejects empty perks array when perks key is wrong type", () => {
    expect(() =>
      godRollDefinitionSchema.parse({ ...validDefinition, perks: "Outlaw,Rampage" }),
    ).toThrow();
  });
});

describe("godRollDefinitionsSchema", () => {
  it("parses an array of definitions", () => {
    const definitions = [
      {
        weaponHash: 3184068932,
        mode: "pvp",
        perks: [{ plugHash: 655892035, name: "Rampage" }],
      },
      {
        weaponHash: 4124984448,
        mode: "pve",
        perks: [{ plugHash: 2846476571, name: "Subsistence" }],
      },
    ];

    expect(godRollDefinitionsSchema.parse(definitions)).toEqual(definitions);
  });
});
