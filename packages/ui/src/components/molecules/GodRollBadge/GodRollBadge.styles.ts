import type { TextStyle, ViewStyle } from "react-native";

import { designTokens } from "../../../theme/index.js";

export const godRollBadgeStyles = {
  badge: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: designTokens.borderRadius.pill,
    borderWidth: 1,
    flexDirection: "row",
    gap: designTokens.spacing.xs,
    justifyContent: "center",
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: 4,
  } satisfies ViewStyle,
  modeLabel: {
    fontSize: designTokens.typography.fontSize.caption,
    fontWeight: designTokens.typography.fontWeight.bold,
    letterSpacing: designTokens.typography.letterSpacing.badge,
    lineHeight: designTokens.typography.lineHeight.caption,
    textTransform: "uppercase",
  } satisfies TextStyle,
  statusLabel: {
    fontSize: designTokens.typography.fontSize.caption,
    fontWeight: designTokens.typography.fontWeight.bold,
    letterSpacing: designTokens.typography.letterSpacing.badge,
    lineHeight: designTokens.typography.lineHeight.caption,
    textTransform: "uppercase",
  } satisfies TextStyle,
  scoreLabel: {
    fontSize: designTokens.typography.fontSize.caption,
    fontWeight: designTokens.typography.fontWeight.semibold,
    lineHeight: designTokens.typography.lineHeight.caption,
  } satisfies TextStyle,
};
