import { describe, expect, it } from "vitest";

import weaponsInventoryFixture from "../fixtures/weapons-inventory.json";
import { extractWeaponPerks, mapInventoryWeapons } from "./inventory.js";

const CHARACTER_ID = "2305789507540360956";

describe("extractWeaponPerks", () => {
  it("extracts perks from socket plugs", () => {
    const perks = extractWeaponPerks("6913529092654216196", weaponsInventoryFixture);

    expect(perks).toEqual([
      { plugHash: 1467527085, name: "Firefly" },
      { plugHash: 3177301540, name: "Explosive Payload" },
    ]);
  });

  it("returns an empty list when sockets are empty", () => {
    expect(extractWeaponPerks("6913529092654216199", weaponsInventoryFixture)).toEqual([]);
  });

  it("uses reusable plugs for crafted weapons with empty socket plugs", () => {
    const perks = extractWeaponPerks("6913529092654216197", weaponsInventoryFixture);

    expect(perks).toEqual([
      { plugHash: 2847525152, name: "Accurized Rounds" },
      { plugHash: 1820237385, name: "Fourth Times the Charm" },
      { plugHash: 1710791522, name: "Rampage" },
    ]);
  });

  it("falls back to reusable plugs when socket plugHash is null", () => {
    const perks = extractWeaponPerks("6913529092654216201", weaponsInventoryFixture);

    expect(perks).toEqual([
      { plugHash: 1467527085, name: "Firefly" },
      { plugHash: 3177301540, name: "Explosive Payload" },
    ]);
  });
});

describe("mapInventoryWeapons", () => {
  it("maps character and vault weapons and filters non-weapon items", () => {
    const weapons = mapInventoryWeapons(weaponsInventoryFixture, CHARACTER_ID);

    expect(weapons).toHaveLength(5);
    expect(
      weapons.find((weapon) => weapon.itemInstanceId === "6913529092654216198"),
    ).toBeUndefined();

    const fatebringer = weapons.find((weapon) => weapon.itemInstanceId === "6913529092654216196");
    expect(fatebringer).toEqual({
      itemHash: 1363886209,
      itemInstanceId: "6913529092654216196",
      name: "Fatebringer (Timelost)",
      tier: "Legendary",
      power: 1985,
      perks: [
        { plugHash: 1467527085, name: "Firefly" },
        { plugHash: 3177301540, name: "Explosive Payload" },
      ],
      location: "character",
      bucketHash: 149531261,
      isEquipped: false,
    });

    const vaultWeapon = weapons.find((weapon) => weapon.itemInstanceId === "6913529092654216200");
    expect(vaultWeapon?.location).toBe("vault");
    expect(vaultWeapon?.name).toBe("Vault Test Shotgun");

    const equipped = weapons.find((weapon) => weapon.itemInstanceId === "6913529092654216199");
    expect(equipped?.isEquipped).toBe(true);
    expect(equipped?.bucketHash).toBe(953998645);
  });

  it("still returns character weapons when vault inventory is privacy-hidden", () => {
    const profile = {
      ...weaponsInventoryFixture,
      profileInventory: { items: [], privacy: 2 },
    };

    const weapons = mapInventoryWeapons(profile, CHARACTER_ID);
    expect(weapons.every((weapon) => weapon.location === "character")).toBe(true);
    expect(weapons).toHaveLength(3);
  });
});
