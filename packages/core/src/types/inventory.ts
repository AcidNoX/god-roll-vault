export type ItemLocation = "vault" | "character";

export type WeaponElement = "kinetic" | "arc" | "solar" | "void" | "stasis" | "strand" | "unknown";

export type WeaponPerk = {
  plugHash: number;
  name: string;
};

export type InventoryWeapon = {
  itemHash: number;
  itemInstanceId: string;
  name: string;
  tier: string;
  power: number;
  element: WeaponElement;
  perks: WeaponPerk[];
  location: ItemLocation;
  bucketHash: number;
  isEquipped: boolean;
};
