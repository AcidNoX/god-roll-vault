import type { InventoryWeapon } from "@god-roll-vault/core";
import { registerPlugDefinition } from "@god-roll-vault/destiny-data";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { BungieClient } from "../client.js";
import { wrapBungieResponse } from "../fixtures/envelope.js";
import { enrichInventoryWeapons } from "./enrich-inventory.js";

const TEST_BASE_URL = "https://bungie.test/Platform";
const API_KEY = "test-api-key";

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function createClient() {
  return new BungieClient({
    apiKey: API_KEY,
    baseUrl: TEST_BASE_URL,
  });
}

describe("enrichInventoryWeapons", () => {
  it("fetches Bungie manifest definitions for unknown perk hashes", async () => {
    server.use(
      http.get(`${TEST_BASE_URL}/Destiny2/Manifest/DestinyInventoryItemDefinition/999888777/`, () =>
        HttpResponse.json(
          wrapBungieResponse({
            displayProperties: {
              name: "Opening Shot",
            },
            itemType: 3,
          }),
        ),
      ),
    );

    const weapons: InventoryWeapon[] = [
      {
        itemHash: 1363886209,
        itemInstanceId: "1",
        name: "Fatebringer (Timelost)",
        tier: "Legendary",
        power: 1980,
        element: "kinetic",
        perks: [{ plugHash: 999888777, name: "Unknown Perk (999888777)" }],
        location: "character",
        bucketHash: 149531261,
        isEquipped: false,
      },
    ];

    const enriched = await enrichInventoryWeapons(createClient(), weapons);

    expect(enriched[0]?.perks[0]?.name).toBe("Opening Shot");
    registerPlugDefinition(999888777, { name: "Opening Shot" });
  });
});
