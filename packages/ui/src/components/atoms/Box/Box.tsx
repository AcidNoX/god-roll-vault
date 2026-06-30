import { View } from "react-native";

import type { BoxProps } from "./Box.types.js";
import { createBoxStyle } from "./Box.utils.js";

export function Box({
  backgroundColor,
  borderColor,
  children,
  margin,
  marginBottom,
  marginHorizontal,
  marginLeft,
  marginRight,
  marginTop,
  marginVertical,
  padding,
  paddingBottom,
  paddingHorizontal,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingVertical,
  style,
  ...viewProps
}: BoxProps) {
  const boxStyle = createBoxStyle({
    backgroundColor,
    borderColor,
    margin,
    marginBottom,
    marginHorizontal,
    marginLeft,
    marginRight,
    marginTop,
    marginVertical,
    padding,
    paddingBottom,
    paddingHorizontal,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingVertical,
  });

  return (
    <View {...viewProps} style={[boxStyle, style]}>
      {children}
    </View>
  );
}
