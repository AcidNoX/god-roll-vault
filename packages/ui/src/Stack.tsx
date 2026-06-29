import type { ViewStyle } from "react-native";

import { Box, type BoxProps } from "./Box.js";
import { resolveSpacing, type SpacingValue } from "./theme.js";

export type StackDirection = "horizontal" | "vertical";

export type StackProps = BoxProps & {
  align?: ViewStyle["alignItems"];
  direction?: StackDirection;
  gap?: SpacingValue;
  justify?: ViewStyle["justifyContent"];
  wrap?: boolean;
};

export function Stack({
  align,
  direction = "vertical",
  gap = "md",
  justify,
  style,
  wrap = false,
  ...boxProps
}: StackProps) {
  const stackStyle: ViewStyle = {
    alignItems: align,
    flexDirection: direction === "horizontal" ? "row" : "column",
    flexWrap: wrap ? "wrap" : "nowrap",
    gap: resolveSpacing(gap),
    justifyContent: justify,
  };

  return <Box {...boxProps} style={[stackStyle, style]} />;
}
