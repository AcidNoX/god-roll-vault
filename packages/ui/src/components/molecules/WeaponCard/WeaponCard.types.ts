import type { InventoryWeapon, RollMatchResult } from "@god-roll-vault/core";
import type { GestureResponderEvent, TextStyle, ViewStyle } from "react-native";

export type WeaponCardProps = {
  weapon: InventoryWeapon;
  matchResult?: RollMatchResult;
  onPress?: (event: GestureResponderEvent) => void;
};

export type BadgePresentation = {
  label: string;
  containerStyle: ViewStyle;
  textStyle: TextStyle;
};

export type ElementPresentation = {
  label: string;
  icon: string;
  containerStyle: ViewStyle;
  textStyle: TextStyle;
};
