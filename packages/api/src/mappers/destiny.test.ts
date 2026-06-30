import { describe, expect, it } from "vitest";

import charactersFixture from "../fixtures/characters.json";
import membershipsFixture from "../fixtures/memberships.json";
import { mapCharacters, mapMemberships, resolvePlayableMemberships } from "./destiny.js";

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

describe("resolvePlayableMemberships", () => {
  it("returns only the cross-save primary membership when set", () => {
    expect(
      resolvePlayableMemberships({
        destinyMemberships: [
          {
            membershipType: 5,
            membershipId: "4611686018501887616",
            displayName: "Stadia",
          },
          {
            membershipType: 3,
            membershipId: "4611686018467427903",
            displayName: "Steam",
          },
        ],
        primaryMembershipId: "4611686018467427903",
      }),
    ).toEqual([
      {
        membershipType: 3,
        membershipId: "4611686018467427903",
        displayName: "Steam",
      },
    ]);
  });

  it("drops deprecated platforms when no primary membership is set", () => {
    expect(
      resolvePlayableMemberships({
        destinyMemberships: [
          {
            membershipType: 5,
            membershipId: "4611686018501887616",
            displayName: "Stadia",
          },
          {
            membershipType: 1,
            membershipId: "123",
            displayName: "Xbox",
          },
        ],
      }),
    ).toEqual([
      {
        membershipType: 1,
        membershipId: "123",
        displayName: "Xbox",
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
