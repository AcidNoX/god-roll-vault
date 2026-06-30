import type { GameMode, MatchStatus } from "@god-roll-vault/core";
import type { TextStyle, ViewProps, ViewStyle } from "react-native";

export type GodRollBadgeProps = Omit<ViewProps, "accessibilityLabel" | "children"> & {
  mode: GameMode;
  score?: number;
  status: MatchStatus;
};

export type GodRollBadgePresentation = {
  accessibilityDescription: string;
  label: string;
  containerStyle: ViewStyle;
  textStyle: TextStyle;
};
