import type { TextStyle, ViewStyle } from "react-native";

import { designTokens } from "../../../theme/index.js";

export const weaponCardStyles = {
  card: {
    alignItems: "center",
    backgroundColor: designTokens.colors.surface,
    borderColor: designTokens.colors.border,
    borderRadius: designTokens.borderRadius.md,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 72,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: 10,
  } satisfies ViewStyle,
  pressableCard: {
    cursor: "pointer",
  } satisfies ViewStyle,
  pressedCard: {
    opacity: 0.82,
  } satisfies ViewStyle,
  elementIcon: {
    alignItems: "center",
    borderRadius: designTokens.borderRadius.lg,
    borderWidth: 1,
    height: 32,
    justifyContent: "center",
    marginRight: designTokens.spacing.md,
    width: 32,
  } satisfies ViewStyle,
  elementIconText: {
    fontSize: designTokens.typography.fontSize.caption,
    fontWeight: designTokens.typography.fontWeight.bold,
    lineHeight: designTokens.typography.lineHeight.caption,
  } satisfies TextStyle,
  weaponDetails: {
    flex: 1,
    minWidth: 0,
  } satisfies ViewStyle,
  weaponName: {
    color: designTokens.colors.text,
    fontSize: designTokens.typography.fontSize.body,
    fontWeight: designTokens.typography.fontWeight.bold,
    lineHeight: designTokens.typography.lineHeight.body,
  } satisfies TextStyle,
  metadataRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: designTokens.spacing.xs,
  } satisfies ViewStyle,
  powerText: {
    color: designTokens.colors.textMuted,
    fontSize: designTokens.typography.fontSize.small,
    fontWeight: designTokens.typography.fontWeight.semibold,
    lineHeight: designTokens.typography.lineHeight.small,
  } satisfies TextStyle,
  badge: {
    alignItems: "center",
    borderRadius: designTokens.borderRadius.pill,
    borderWidth: 1,
    justifyContent: "center",
    marginLeft: 10,
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: 3,
  } satisfies ViewStyle,
  badgeText: {
    fontSize: designTokens.typography.fontSize.caption,
    fontWeight: designTokens.typography.fontWeight.bold,
    letterSpacing: designTokens.typography.letterSpacing.badge,
    lineHeight: designTokens.typography.lineHeight.caption,
    textTransform: "uppercase",
  } satisfies TextStyle,
};
