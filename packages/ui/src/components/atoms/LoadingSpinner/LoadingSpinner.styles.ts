import type { ViewStyle } from "react-native";

import { designTokens } from "../../../theme/index.js";

export const loadingSpinnerStyles = {
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: designTokens.spacing.xl,
  } satisfies ViewStyle,
};
