import type { TextStyle } from "react-native";

import { theme } from "../../../theme/index.js";
import type { TextProps } from "./Text.types.js";

export function createTextStyle({
  color = "text",
  variant = "body",
}: Pick<TextProps, "color" | "variant">): TextStyle {
  return {
    color: theme.colors[color],
    ...theme.typography[variant],
  };
}
