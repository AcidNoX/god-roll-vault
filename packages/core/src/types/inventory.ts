export type ItemLocation = "vault" | "character";

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
  perks: WeaponPerk[];
  location: ItemLocation;
  bucketHash: number;
  isEquipped: boolean;
};
