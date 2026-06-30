import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export type EmptyStateProps = {
  icon: ReactNode;
  message: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};
