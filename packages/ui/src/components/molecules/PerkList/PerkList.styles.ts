import type { ImageStyle, TextStyle, ViewStyle } from "react-native";

import { designTokens } from "../../../theme/index.js";

export const perkListStyles = {
  container: {
    gap: designTokens.spacing.sm,
  } satisfies ViewStyle,
  row: {
    borderRadius: designTokens.borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
  } satisfies ViewStyle,
  rowHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  } satisfies ViewStyle,
  label: {
    fontSize: designTokens.typography.fontSize.caption,
    fontWeight: designTokens.typography.fontWeight.bold,
    letterSpacing: designTokens.typography.letterSpacing.badge,
    lineHeight: designTokens.typography.lineHeight.caption,
    textTransform: "uppercase",
  } satisfies TextStyle,
  status: {
    fontSize: designTokens.typography.fontSize.caption,
    fontWeight: designTokens.typography.fontWeight.bold,
    letterSpacing: designTokens.typography.letterSpacing.badge,
    lineHeight: designTokens.typography.lineHeight.caption,
    textTransform: "uppercase",
  } satisfies TextStyle,
  value: {
    fontSize: designTokens.typography.fontSize.body,
    fontWeight: designTokens.typography.fontWeight.semibold,
    lineHeight: designTokens.typography.lineHeight.body,
  } satisfies TextStyle,
  valueRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: designTokens.spacing.sm,
    marginTop: designTokens.spacing.xs,
  } satisfies ViewStyle,
  perkIcon: {
    borderRadius: designTokens.borderRadius.sm,
    height: 24,
    width: 24,
  } satisfies ImageStyle,
  target: {
    color: designTokens.colors.textMuted,
    fontSize: designTokens.typography.fontSize.small,
    fontWeight: designTokens.typography.fontWeight.regular,
    lineHeight: designTokens.typography.lineHeight.small,
    marginTop: 2,
  } satisfies TextStyle,
};
