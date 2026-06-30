import type { SeasonDefinition } from "@god-roll-vault/destiny-data";

import type { DestinySeasonDefinition } from "../schemas/manifest-season.js";

export function mapSeasonDefinition(definition: DestinySeasonDefinition): SeasonDefinition {
  return {
    iconPath: definition.displayProperties.icon,
  };
}
