import type { TextStyle, ViewStyle } from "react-native";

import { designTokens } from "../../../theme/index.js";

export const weaponGroupCardStyles = {
  container: {
    gap: designTokens.spacing.sm,
  } satisfies ViewStyle,
  duplicateContainer: {
    backgroundColor: designTokens.colors.surfaceRaised,
    borderColor: designTokens.colors.border,
    borderRadius: designTokens.borderRadius.lg,
    borderWidth: 1,
    padding: designTokens.spacing.md,
  } satisfies ViewStyle,
  header: {
    gap: designTokens.spacing.xs,
    marginBottom: designTokens.spacing.xs,
  } satisfies ViewStyle,
  title: {
    fontSize: designTokens.typography.fontSize.small,
    fontWeight: designTokens.typography.fontWeight.bold,
    letterSpacing: designTokens.typography.letterSpacing.badge,
    textTransform: "uppercase",
  } satisfies TextStyle,
  summary: {
    fontSize: designTokens.typography.fontSize.caption,
    lineHeight: designTokens.typography.lineHeight.caption,
  } satisfies TextStyle,
};
