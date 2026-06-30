import type { SeasonDefinition } from "@god-roll-vault/destiny-data";
import { getSeasonDefinition, registerSeasonDefinition } from "@god-roll-vault/destiny-data";

import type { BungieClient } from "../client.js";

export async function prefetchSeasonDefinitions(
  client: BungieClient,
  seasonHashes: Iterable<number>,
): Promise<void> {
  const missingHashes = [...new Set(seasonHashes)].filter(
    (seasonHash) => !getSeasonDefinition(seasonHash),
  );

  await Promise.all(
    missingHashes.map(async (seasonHash) => {
      const definition = await client.getSeasonDefinition(seasonHash);
      if (!definition) {
        return;
      }

      registerSeasonDefinition(seasonHash, definition);
    }),
  );
}

export type { SeasonDefinition };
