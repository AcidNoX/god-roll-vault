import type { ActivityIndicatorProps, StyleProp, ViewStyle } from "react-native";

export type LoadingSpinnerProps = Pick<ActivityIndicatorProps, "color" | "size"> & {
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};
