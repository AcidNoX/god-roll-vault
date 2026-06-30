import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import type { Theme } from "./theme.types.js";

export type ThemeProviderProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  theme?: Theme;
};
