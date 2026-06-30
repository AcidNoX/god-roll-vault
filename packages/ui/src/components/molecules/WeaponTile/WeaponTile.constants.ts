import type { InventoryWeapon, WeaponTierType } from "@god-roll-vault/core";

import { designTokens } from "../../../theme/index.js";
import { elementPresentationByType } from "../WeaponCard/WeaponCard.constants.js";

export const DEFAULT_WEAPON_TILE_SIZE = 50;

const TIER_BACKGROUND: Record<WeaponTierType, string> = {
  exotic: "#ceae33",
  legendary: "#522f65",
  rare: "#5076a3",
  uncommon: "#366f42",
  common: "#366f42",
  basic: "#c3bcb4",
  unknown: "#3d3e40",
};

export function resolveWeaponTierType(weapon: {
  tierType?: WeaponTierType;
  tier: string;
}): WeaponTierType {
  if (weapon.tierType) {
    return weapon.tierType;
  }

  const normalizedTier = weapon.tier.toLowerCase();
  if (normalizedTier === "exotic") return "exotic";
  if (normalizedTier === "legendary") return "legendary";
  if (normalizedTier === "rare") return "rare";
  if (normalizedTier === "uncommon") return "uncommon";
  if (normalizedTier === "common") return "common";
  if (normalizedTier === "basic") return "basic";
  return "unknown";
}

export function getTileBackgroundColor(tierType: WeaponTierType): string {
  return TIER_BACKGROUND[tierType];
}

export function getTileDiamondCount(tierType: WeaponTierType): number {
  switch (tierType) {
    case "legendary":
      return 4;
    case "rare":
      return 3;
    case "uncommon":
      return 2;
    case "common":
      return 1;
    default:
      return 0;
  }
}

export function getTileElementAccent(element: InventoryWeapon["element"]): string {
  return elementPresentationByType[element]?.textStyle.color ?? designTokens.colors.textMuted;
}
