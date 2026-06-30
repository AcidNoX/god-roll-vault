import type { ViewStyle } from "react-native";

import { resolveSpacing } from "../../../theme/index.js";
import type { StackProps } from "./Stack.types.js";

export function createStackStyle({
  align,
  direction = "vertical",
  gap = "md",
  justify,
  wrap = false,
}: Pick<StackProps, "align" | "direction" | "gap" | "justify" | "wrap">): ViewStyle {
  return {
    alignItems: align,
    flexDirection: direction === "horizontal" ? "row" : "column",
    flexWrap: wrap ? "wrap" : "nowrap",
    gap: resolveSpacing(gap),
    justifyContent: justify,
  };
}
