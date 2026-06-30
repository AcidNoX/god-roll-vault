import { registerWeaponDefinition } from "@god-roll-vault/destiny-data";
import { describe, expect, it } from "vitest";

import weaponsInventoryFixture from "../fixtures/weapons-inventory.json";
import { extractWeaponPerks, mapInventoryWeapons } from "./inventory.js";

const CHARACTER_ID = "2305789507540360956";

describe("extractWeaponPerks", () => {
  it("extracts perks from socket plugs", () => {
    const perks = extractWeaponPerks("6913529092654216196", weaponsInventoryFixture);

    expect(perks).toEqual([
      {
        plugHash: 1467527085,
        name: "Firefly",
        iconUrl:
          "https://www.bungie.net/common/destiny2_content/icons/d9e5e8fa07a84c29252b78b0e7b3106d.png",
      },
      {
        plugHash: 3177301540,
        name: "Explosive Payload",
        iconUrl:
          "https://www.bungie.net/common/destiny2_content/icons/d41dd918d42681c5b0ad00880274b22c.png",
      },
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
      {
        plugHash: 1467527085,
        name: "Firefly",
        iconUrl:
          "https://www.bungie.net/common/destiny2_content/icons/d9e5e8fa07a84c29252b78b0e7b3106d.png",
      },
      {
        plugHash: 3177301540,
        name: "Explosive Payload",
        iconUrl:
          "https://www.bungie.net/common/destiny2_content/icons/d41dd918d42681c5b0ad00880274b22c.png",
      },
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
    expect(fatebringer).toMatchObject({
      itemHash: 1363886209,
      itemInstanceId: "6913529092654216196",
      name: "Fatebringer (Timelost)",
      tier: "Legendary",
      tierType: "legendary",
      power: 1985,
      element: "kinetic",
      iconUrl:
        "https://www.bungie.net/common/destiny2_content/icons/b62083eed6a4708e581fc9a061bcc8e9.jpg",
      perks: [
        {
          plugHash: 1467527085,
          name: "Firefly",
          iconUrl:
            "https://www.bungie.net/common/destiny2_content/icons/d9e5e8fa07a84c29252b78b0e7b3106d.png",
        },
        {
          plugHash: 3177301540,
          name: "Explosive Payload",
          iconUrl:
            "https://www.bungie.net/common/destiny2_content/icons/d41dd918d42681c5b0ad00880274b22c.png",
        },
      ],
      location: "character",
      bucketHash: 149531261,
      isEquipped: false,
      isShiny: false,
      isMasterwork: true,
    });

    const vaultWeapon = weapons.find((weapon) => weapon.itemInstanceId === "6913529092654216200");
    expect(vaultWeapon?.location).toBe("vault");
    expect(vaultWeapon?.name).toBe("Vault Test Shotgun");

    const arcWeapon = weapons.find((weapon) => weapon.itemInstanceId === "6913529092654216197");
    expect(arcWeapon?.element).toBe("arc");

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

  it("maps weapon icon URLs when curated manifest asset paths exist", () => {
    const profile = {
      characterInventories: {
        [CHARACTER_ID]: {
          items: [
            {
              itemHash: 4219826183,
              itemInstanceId: "icon-weapon-instance",
              bucketHash: 149531261,
              quantity: 1,
            },
          ],
        },
      },
      characterEquipment: {
        [CHARACTER_ID]: { items: [] },
      },
      profileInventory: { items: [], privacy: 1 },
      itemComponents: {
        instances: {
          data: {
            "icon-weapon-instance": {
              primaryStat: { value: 1980 },
              damageTypeHash: 3373582085,
            },
          },
        },
        sockets: {
          data: {},
        },
      },
    };

    expect(mapInventoryWeapons(profile, CHARACTER_ID)[0]).toMatchObject({
      itemHash: 4219826183,
      name: "Fatebringer (Timelost)",
      iconUrl:
        "https://www.bungie.net/common/destiny2_content/icons/0e281ebb76f5e5ba169bd44c036fcf39.jpg",
    });
  });

  it("includes unequipped weapons when manifest marks them as weapons", () => {
    registerWeaponDefinition(5555555555, {
      name: "Test AR",
      tier: "Legendary",
      itemType: 3,
    });

    const profile = {
      characterInventories: {
        [CHARACTER_ID]: {
          items: [
            {
              itemHash: 5555555555,
              itemInstanceId: "inv-weapon",
              bucketHash: 1234567890,
              quantity: 1,
            },
          ],
        },
      },
      characterEquipment: {
        [CHARACTER_ID]: { items: [] },
      },
      profileInventory: { items: [], privacy: 1 },
      itemComponents: {
        instances: {
          data: {
            "inv-weapon": {
              primaryStat: { value: 1980 },
              damageTypeHash: 3373582085,
            },
          },
        },
        sockets: { data: {} },
      },
    };

    expect(mapInventoryWeapons(profile, CHARACTER_ID)).toEqual([
      expect.objectContaining({
        itemHash: 5555555555,
        itemInstanceId: "inv-weapon",
        name: "Test AR",
      }),
    ]);
  });
});
