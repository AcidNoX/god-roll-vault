export type WeaponTierType =
  | "exotic"
  | "legendary"
  | "rare"
  | "uncommon"
  | "common"
  | "basic"
  | "unknown";

export type ItemLocation = "vault" | "character";

export type WeaponElement = "kinetic" | "arc" | "solar" | "void" | "stasis" | "strand" | "unknown";

export type WeaponPerk = {
  plugHash: number;
  name: string;
  iconUrl?: string;
};

export type WeaponPerks = {
  barrel?: WeaponPerk;
  magazine?: WeaponPerk;
  perk1?: WeaponPerk;
  perk2?: WeaponPerk;
  originTrait?: WeaponPerk;
};

export type InventoryWeapon = {
  itemHash: number;
  itemInstanceId: string;
  name: string;
  iconUrl?: string;
  tier: string;
  tierType?: WeaponTierType;
  power: number;
  element: WeaponElement;
  perks: WeaponPerk[];
  location: ItemLocation;
  bucketHash: number;
  isEquipped: boolean;
  isShiny?: boolean;
  isMasterwork?: boolean;
  seasonIconUrl?: string;
  watermarkIconUrl?: string;
};
