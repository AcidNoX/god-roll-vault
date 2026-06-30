import type { TextStyle, ViewStyle } from "react-native";

export const errorStateStyles = {
  container: {
    width: "100%",
  } satisfies ViewStyle,
  message: {
    maxWidth: 360,
    textAlign: "center",
  } satisfies TextStyle,
  retryLabel: {
    textAlign: "center",
  } satisfies TextStyle,
};
