import {
  getPlugDefinition,
  getWeaponDefinition,
  registerPlugDefinition,
  registerWeaponDefinition,
} from "@god-roll-vault/destiny-data";

import type { BungieClient } from "../client.js";

export async function prefetchInventoryItemDefinitions(
  client: BungieClient,
  itemHashes: Iterable<number>,
): Promise<void> {
  const missingHashes = [...new Set(itemHashes)].filter(
    (itemHash) => !getWeaponDefinition(itemHash),
  );

  await Promise.all(
    missingHashes.map(async (itemHash) => {
      const definition = await client.getInventoryItemDefinition(itemHash);
      if (!definition) {
        return;
      }

      registerWeaponDefinition(itemHash, definition);
    }),
  );
}

export async function prefetchPlugDefinitions(
  client: BungieClient,
  plugHashes: Iterable<number>,
): Promise<void> {
  const missingHashes = [...new Set(plugHashes)].filter((plugHash) => !getPlugDefinition(plugHash));

  await Promise.all(
    missingHashes.map(async (plugHash) => {
      const definition = await client.getInventoryItemDefinition(plugHash);
      if (!definition) {
        return;
      }

      registerPlugDefinition(plugHash, {
        name: definition.name,
        iconPath: definition.iconPath,
      });
    }),
  );
}
