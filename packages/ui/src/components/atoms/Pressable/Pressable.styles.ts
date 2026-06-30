import type { ViewStyle } from "react-native";

import { theme } from "../../../theme/index.js";

export const pressableStyles = {
  base: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  } satisfies ViewStyle,
  disabled: {
    backgroundColor: theme.colors.disabled,
    opacity: 0.6,
  } satisfies ViewStyle,
  hovered: {
    backgroundColor: theme.colors.primaryHover,
  } satisfies ViewStyle,
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  } satisfies ViewStyle,
};
