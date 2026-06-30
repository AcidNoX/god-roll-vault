import type { TextStyle, ViewStyle } from "react-native";

import { designTokens } from "../../../theme/index.js";

export const emptyStateStyles = {
  container: {
    width: "100%",
  } satisfies ViewStyle,
  icon: {
    alignItems: "center",
    justifyContent: "center",
  } satisfies ViewStyle,
  iconText: {
    color: designTokens.colors.textMuted,
    textAlign: "center",
  } satisfies TextStyle,
  message: {
    maxWidth: 360,
    textAlign: "center",
  } satisfies TextStyle,
};
