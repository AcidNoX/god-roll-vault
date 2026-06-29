import { describe, expect, it } from "vitest";

import type { GodRollEntry } from "./schema.js";
import { godRollEntrySchema } from "./schema.js";
import { formatZodError, validateGodRollEntry, validateGodRollManifest } from "./validate.js";

const validEntry: GodRollEntry = {
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

describe("validateGodRollEntry", () => {
  it("returns no issues for valid schema and manifest data", () => {
    expect(validateGodRollEntry(validEntry)).toEqual([]);
  });

  it("returns clear schema errors for invalid data", () => {
    const issues = validateGodRollEntry({
      weaponHash: "not-a-number",
      weaponName: "",
      rolls: [],
    });

    expect(issues.length).toBeGreaterThan(0);
    expect(issues.some((issue) => issue.path.includes("weaponHash"))).toBe(true);
    expect(issues.some((issue) => issue.message.length > 0)).toBe(true);
  });

  it("can skip manifest checks", () => {
    const roll = validEntry.rolls[0];
    if (!roll) {
      throw new Error("missing fixture roll");
    }

    const issues = validateGodRollEntry(
      {
        ...validEntry,
        weaponName: "Wrong Name",
        rolls: [
          {
            ...roll,
            perks: { ...roll.perks, perk1: ["Not A Real Perk"] },
          },
        ],
      },
      { checkManifest: false },
    );

    expect(issues).toEqual([]);
  });
});

describe("validateGodRollManifest", () => {
  it("flags unknown weapon hashes", () => {
    const issues = validateGodRollManifest({
      ...validEntry,
      weaponHash: 999999999,
      weaponName: "Ghost Gun",
    });

    expect(issues).toContainEqual(
      expect.objectContaining({
        path: "weaponHash",
        message: expect.stringContaining("not in mvp-weapons.json"),
      }),
    );
  });

  it("flags weapon names that do not match the manifest", () => {
    const issues = validateGodRollManifest({
      ...validEntry,
      weaponName: "Palindrome",
    });

    expect(issues).toContainEqual(
      expect.objectContaining({
        path: "weaponName",
        message: expect.stringContaining('expected "The Palindrome (Adept)"'),
      }),
    );
  });

  it("flags perk names missing from mvp-plugs.json", () => {
    const roll = validEntry.rolls[0];
    if (!roll) {
      throw new Error("missing fixture roll");
    }

    const issues = validateGodRollManifest({
      ...validEntry,
      rolls: [
        {
          ...roll,
          perks: {
            ...roll.perks,
            magazine: ["Ricochet Rounds"],
          },
        },
      ],
    });

    expect(issues).toContainEqual(
      expect.objectContaining({
        path: "rolls.0.perks.magazine",
        message: expect.stringContaining('unknown perk name "Ricochet Rounds"'),
      }),
    );
  });
});

describe("formatZodError", () => {
  it("includes dotted paths for nested fields", () => {
    const parsed = godRollEntrySchema.safeParse({
      weaponHash: -1,
      weaponName: "x",
      rolls: [],
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const formatted = formatZodError(parsed.error, "example.json");
      expect(formatted[0]?.file).toBe("example.json");
      expect(formatted[0]?.path).toBeTruthy();
    }
  });
});
