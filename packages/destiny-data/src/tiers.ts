export type WeaponTierType =
  | "exotic"
  | "legendary"
  | "rare"
  | "uncommon"
  | "common"
  | "basic"
  | "unknown";

/** Bungie `DestinyTierType` values. */
export const BUNGIE_TIER_TYPE = {
  unknown: 0,
  currency: 1,
  basic: 2,
  common: 3,
  uncommon: 4,
  rare: 5,
  legendary: 6,
  exotic: 7,
} as const;

const TIER_NAME_TO_TYPE: Record<string, WeaponTierType> = {
  exotic: "exotic",
  legendary: "legendary",
  rare: "rare",
  uncommon: "uncommon",
  common: "common",
  basic: "basic",
};

const TIER_TYPE_BACKGROUND: Record<WeaponTierType, string> = {
  exotic: "#ceae33",
  legendary: "#522f65",
  rare: "#5076a3",
  uncommon: "#366f42",
  common: "#366f42",
  basic: "#c3bcb4",
  unknown: "#3d3e40",
};

export function mapBungieTierType(tierType: number | undefined): WeaponTierType {
  switch (tierType) {
    case BUNGIE_TIER_TYPE.exotic:
      return "exotic";
    case BUNGIE_TIER_TYPE.legendary:
      return "legendary";
    case BUNGIE_TIER_TYPE.rare:
      return "rare";
    case BUNGIE_TIER_TYPE.uncommon:
      return "uncommon";
    case BUNGIE_TIER_TYPE.common:
      return "common";
    case BUNGIE_TIER_TYPE.basic:
      return "basic";
    default:
      return "unknown";
  }
}

export function mapTierNameToType(tierName: string | undefined): WeaponTierType {
  if (!tierName) {
    return "unknown";
  }

  return TIER_NAME_TO_TYPE[tierName.toLowerCase()] ?? "unknown";
}

export function getTierBackgroundColor(tierType: WeaponTierType): string {
  return TIER_TYPE_BACKGROUND[tierType];
}

/** DIM-style tier diamonds shown on the left edge of weapon tiles. */
export function getTierDiamondCount(tierType: WeaponTierType): number {
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
