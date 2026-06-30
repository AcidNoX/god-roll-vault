import type { InventoryWeapon } from "@god-roll-vault/core";

export type WeaponTileProps = {
  weapon: InventoryWeapon;
  size?: number;
  selected?: boolean;
  testID?: string;
};
