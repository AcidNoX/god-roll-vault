import type { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";

export type ErrorStateProps = {
  message: string;
  onRetry: (event: GestureResponderEvent) => void;
  retryLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};
