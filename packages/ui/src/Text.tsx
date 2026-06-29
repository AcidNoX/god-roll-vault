import type { ReactNode } from "react";
import type { TextProps as RNTextProps, StyleProp, TextStyle } from "react-native";
import { Text as RNText } from "react-native";

import { type ColorToken, type TextVariant, theme } from "./theme.js";

export type TextProps = Omit<RNTextProps, "style"> & {
  children?: ReactNode;
  color?: ColorToken;
  style?: StyleProp<TextStyle>;
  variant?: TextVariant;
};

export function Text({
  children,
  color = "text",
  style,
  variant = "body",
  ...textProps
}: TextProps) {
  const textStyle: TextStyle = {
    color: theme.colors[color],
    ...theme.typography[variant],
  };

  return (
    <RNText {...textProps} style={[textStyle, style]}>
      {children}
    </RNText>
  );
}
