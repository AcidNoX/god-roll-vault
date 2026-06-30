import { describe, expect, it } from "vitest";

import weaponsInventoryFixture from "../fixtures/weapons-inventory.json";
import { mapInventoryWeapons } from "../mappers/inventory.js";
import { destinyProfileResponseSchema } from "./profile.js";

describe("destinyProfileResponseSchema", () => {
  it("unwraps Bungie dictionary component envelopes", () => {
    const profile = destinyProfileResponseSchema.parse({
      characters: {
        data: {
          "2305789507540360956": {
            characterId: "2305789507540360956",
            classType: 0,
            light: 1985,
            dateLastPlayed: "2026-06-01T12:00:00.000Z",
          },
        },
        privacy: 1,
      },
      characterInventories: {
        data: {
          "2305789507540360956": {
            items: [
              {
                itemHash: 1363886209,
                itemInstanceId: "6913529092654216196",
                bucketHash: 149531261,
                quantity: 1,
              },
            ],
          },
        },
        privacy: 1,
      },
    });

    expect(profile.characters?.["2305789507540360956"]?.light).toBe(1985);
    expect(profile.characterInventories?.["2305789507540360956"]?.items).toHaveLength(1);
  });

  it("unwraps Bungie single-component inventory and item component envelopes", () => {
    const profile = destinyProfileResponseSchema.parse({
      characterInventories: {
        data: weaponsInventoryFixture.characterInventories,
        privacy: 1,
      },
      characterEquipment: {
        data: weaponsInventoryFixture.characterEquipment,
        privacy: 1,
      },
      profileInventory: {
        data: {
          items: weaponsInventoryFixture.profileInventory.items,
        },
        privacy: 1,
      },
      itemComponents: {
        instances: {
          data: weaponsInventoryFixture.itemComponents.instances.data,
        },
        sockets: {
          data: weaponsInventoryFixture.itemComponents.sockets.data,
        },
        reusablePlugs: {
          data: weaponsInventoryFixture.itemComponents.reusablePlugs.data,
        },
      },
    });

    expect(profile.profileInventory?.items).toHaveLength(2);
    expect(profile.itemComponents?.instances?.data["6913529092654216196"]?.primaryStat?.value).toBe(
      1985,
    );
    expect(mapInventoryWeapons(profile, "2305789507540360956")).toHaveLength(5);
  });
});
