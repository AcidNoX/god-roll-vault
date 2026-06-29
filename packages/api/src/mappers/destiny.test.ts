import { describe, expect, it } from "vitest";

import charactersFixture from "../fixtures/characters.json";
import membershipsFixture from "../fixtures/memberships.json";
import { mapCharacters, mapMemberships } from "./destiny.js";

describe("mapMemberships", () => {
  it("maps Bungie memberships to domain types", () => {
    expect(mapMemberships(membershipsFixture)).toEqual([
      {
        membershipType: 3,
        membershipId: "4611686018467427903",
        displayName: "Guardian#1234",
      },
    ]);
  });

  it("falls back to displayName when global name is missing", () => {
    expect(
      mapMemberships({
        destinyMemberships: [
          {
            membershipType: 2,
            membershipId: "123",
            displayName: "LegacyName",
          },
        ],
      }),
    ).toEqual([
      {
        membershipType: 2,
        membershipId: "123",
        displayName: "LegacyName",
      },
    ]);
  });
});

describe("mapCharacters", () => {
  it("maps Bungie character components to domain types", () => {
    expect(mapCharacters(charactersFixture)).toEqual([
      {
        characterId: "2305789507540360956",
        classType: 0,
        light: 1985,
        dateLastPlayed: "2026-06-01T12:00:00.000Z",
      },
      {
        characterId: "2305789507540360957",
        classType: 1,
        light: 1980,
        dateLastPlayed: "2026-05-28T08:30:00.000Z",
      },
    ]);
  });

  it("returns an empty list when characters are missing", () => {
    expect(mapCharacters({})).toEqual([]);
  });
});
