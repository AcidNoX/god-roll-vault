import type {
  GodRollPerkSlot,
  RollMatchResult,
  WeaponPerk,
  WeaponPerks,
} from "@god-roll-vault/core";
import type { TextStyle, ViewProps, ViewStyle } from "react-native";

export type PerkListProps = Omit<ViewProps, "children"> & {
  perks: WeaponPerks;
  matchResult: RollMatchResult;
};

export type PerkListSlotKey = GodRollPerkSlot | "originTrait";

export type PerkListSlotDefinition = {
  key: PerkListSlotKey;
  label: string;
};

export type PerkListSlotStatus = "matched" | "missing" | "neutral";

export type PerkListItem = {
  key: PerkListSlotKey;
  label: string;
  perk?: WeaponPerk;
  target?: string;
  status: PerkListSlotStatus;
};

export type PerkListSlotPresentation = {
  statusLabel: string;
  containerStyle: ViewStyle;
  labelStyle: TextStyle;
  valueStyle: TextStyle;
  statusStyle: TextStyle;
};
