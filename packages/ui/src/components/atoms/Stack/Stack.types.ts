import type { ViewStyle } from "react-native";
import type { SpacingValue } from "../../../theme/index.js";
import type { BoxProps } from "../Box/index.js";

export type StackDirection = "horizontal" | "vertical";

export type StackProps = BoxProps & {
  align?: ViewStyle["alignItems"];
  direction?: StackDirection;
  gap?: SpacingValue;
  justify?: ViewStyle["justifyContent"];
  wrap?: boolean;
};
