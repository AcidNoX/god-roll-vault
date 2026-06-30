import { Text as RNText } from "react-native";

import { createTextStyle } from "./Text.styles.js";
import type { TextProps } from "./Text.types.js";

export function Text({
  children,
  color = "text",
  style,
  variant = "body",
  ...textProps
}: TextProps) {
  const textStyle = createTextStyle({ color, variant });

  return (
    <RNText {...textProps} style={[textStyle, style]}>
      {children}
    </RNText>
  );
}
