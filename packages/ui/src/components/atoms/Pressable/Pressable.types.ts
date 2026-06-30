import type { ReactNode } from "react";
import type { PressableProps as RNPressableProps, StyleProp, ViewStyle } from "react-native";

export type PressableState = {
  focused?: boolean;
  hovered?: boolean;
  pressed: boolean;
};

export type PressableProps = Omit<RNPressableProps, "style"> & {
  children?: ReactNode | ((state: PressableState) => ReactNode);
  style?: StyleProp<ViewStyle> | ((state: PressableState) => StyleProp<ViewStyle>);
};
