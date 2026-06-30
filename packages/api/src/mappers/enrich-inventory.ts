import type { InventoryWeapon } from "@god-roll-vault/core";
import {
  getPerkIconUrl,
  getPerkName,
  getPlugDefinition,
  getSeasonIconUrl,
  getWeaponIconUrl,
  getWeaponName,
  getWeaponSeasonHash,
  getWeaponTier,
  getWeaponTierType,
  getWeaponWatermarkIconUrl,
} from "@god-roll-vault/destiny-data";

import type { BungieClient } from "../client.js";
import { prefetchPlugDefinitions } from "./prefetch-manifest.js";

function refreshWeaponDisplay(weapon: InventoryWeapon): InventoryWeapon {
  const iconUrl = getWeaponIconUrl(weapon.itemHash);
  const seasonHash = getWeaponSeasonHash(weapon.itemHash);

  return {
    ...weapon,
    name: getWeaponName(weapon.itemHash),
    tier: getWeaponTier(weapon.itemHash),
    tierType: getWeaponTierType(weapon.itemHash),
    seasonIconUrl: getSeasonIconUrl(seasonHash),
    watermarkIconUrl: getWeaponWatermarkIconUrl(weapon.itemHash),
    perks: weapon.perks.map((perk) => {
      const perkIconUrl = getPerkIconUrl(perk.plugHash);
      return {
        ...perk,
        name: getPerkName(perk.plugHash),
        ...(perkIconUrl ? { iconUrl: perkIconUrl } : {}),
      };
    }),
    ...(iconUrl ? { iconUrl } : {}),
  };
}

export async function enrichInventoryWeapons(
  client: BungieClient,
  weapons: InventoryWeapon[],
): Promise<InventoryWeapon[]> {
  const missingPlugHashes = new Set<number>();

  for (const weapon of weapons) {
    for (const perk of weapon.perks) {
      if (!getPlugDefinition(perk.plugHash)) {
        missingPlugHashes.add(perk.plugHash);
      }
    }
  }

  await prefetchPlugDefinitions(client, missingPlugHashes);

  return weapons.map(refreshWeaponDisplay);
}
