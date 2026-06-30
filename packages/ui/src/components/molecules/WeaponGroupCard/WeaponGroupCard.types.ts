import type { WeaponDuplicateGroup } from "@god-roll-vault/core";

export type WeaponGroupCardProps = {
  group: WeaponDuplicateGroup;
  onSelectInstance?: (itemInstanceId: string) => void;
};
