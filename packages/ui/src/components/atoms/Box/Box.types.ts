import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";

import type { ColorToken, SpacingValue } from "../../../theme/index.js";

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
