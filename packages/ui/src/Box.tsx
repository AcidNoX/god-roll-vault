import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";

import { type ColorToken, resolveSpacing, type SpacingValue, theme } from "./theme.js";

export type BoxProps = Omit<ViewProps, "style"> & {
  backgroundColor?: ColorToken;
  borderColor?: ColorToken;
  children?: ReactNode;
  margin?: SpacingValue;
  marginBottom?: SpacingValue;
  marginHorizontal?: SpacingValue;
  marginLeft?: SpacingValue;
  marginRight?: SpacingValue;
  marginTop?: SpacingValue;
  marginVertical?: SpacingValue;
  padding?: SpacingValue;
  paddingBottom?: SpacingValue;
  paddingHorizontal?: SpacingValue;
  paddingLeft?: SpacingValue;
  paddingRight?: SpacingValue;
  paddingTop?: SpacingValue;
  paddingVertical?: SpacingValue;
  style?: StyleProp<ViewStyle>;
};

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
  const boxStyle: ViewStyle = {
    backgroundColor: backgroundColor ? theme.colors[backgroundColor] : undefined,
    borderColor: borderColor ? theme.colors[borderColor] : undefined,
    margin: resolveSpacing(margin),
    marginBottom: resolveSpacing(marginBottom),
    marginHorizontal: resolveSpacing(marginHorizontal),
    marginLeft: resolveSpacing(marginLeft),
    marginRight: resolveSpacing(marginRight),
    marginTop: resolveSpacing(marginTop),
    marginVertical: resolveSpacing(marginVertical),
    padding: resolveSpacing(padding),
    paddingBottom: resolveSpacing(paddingBottom),
    paddingHorizontal: resolveSpacing(paddingHorizontal),
    paddingLeft: resolveSpacing(paddingLeft),
    paddingRight: resolveSpacing(paddingRight),
    paddingTop: resolveSpacing(paddingTop),
    paddingVertical: resolveSpacing(paddingVertical),
  };

  return (
    <View {...viewProps} style={[boxStyle, style]}>
      {children}
    </View>
  );
}
