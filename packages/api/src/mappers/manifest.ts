import type { WeaponDefinition } from "@god-roll-vault/destiny-data";

import type { DestinyInventoryItemDefinition } from "../schemas/manifest-item.js";

export function mapInventoryItemDefinition(
  definition: DestinyInventoryItemDefinition,
): WeaponDefinition {
  return {
    name: definition.displayProperties.name,
    tier: definition.inventory?.tierTypeName ?? "Unknown",
    iconPath: definition.displayProperties.icon,
    itemType: definition.itemType,
    tierType: definition.inventory?.tierType,
    seasonHash: definition.seasonHash,
    watermarkIconPath:
      definition.displayProperties.iconWatermark ??
      definition.displayProperties.iconWatermarkShelved,
  };
}
