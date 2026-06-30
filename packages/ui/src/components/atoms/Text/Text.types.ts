import type { ReactNode } from "react";
import type { TextProps as RNTextProps, StyleProp, TextStyle } from "react-native";

import type { ColorToken, TextVariant } from "../../../theme/index.js";

export type TextProps = Omit<RNTextProps, "style"> & {
  children?: ReactNode;
  color?: ColorToken;
  style?: StyleProp<TextStyle>;
  variant?: TextVariant;
};
