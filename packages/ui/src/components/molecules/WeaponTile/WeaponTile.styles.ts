import type { ImageStyle, TextStyle, ViewStyle } from "react-native";

import { designTokens } from "../../../theme/index.js";

export function createWeaponTileStyles(size: number) {
  const borderWidth = 2;
  const innerSize = size - borderWidth * 2;
  const powerBarHeight = Math.max(10, Math.round(size * 0.22));
  const seasonIconSize = Math.max(10, Math.round(size * 0.24));
  const diamondSize = Math.max(3, Math.round(size * 0.07));
  const diamondGap = 1;
  const weaponIconSize = Math.round(size * 0.72);

  return {
    tile: {
      borderWidth,
      borderColor: "#2a2b2c",
      borderRadius: 2,
      height: size,
      overflow: "hidden",
      position: "relative",
      width: size,
    } satisfies ViewStyle,
    exoticBorder: {
      borderColor: "#e8c252",
    } satisfies ViewStyle,
    selectedBorder: {
      borderColor: designTokens.colors.borderStrong,
    } satisfies ViewStyle,
    watermark: {
      height: innerSize,
      left: borderWidth,
      opacity: 0.35,
      position: "absolute",
      top: borderWidth,
      width: innerSize,
    } satisfies ImageStyle,
    tierDiamonds: {
      alignItems: "center",
      bottom: powerBarHeight + 2,
      justifyContent: "center",
      left: 1,
      position: "absolute",
      top: 2,
      width: diamondSize + 2,
    } satisfies ViewStyle,
    tierDiamond: {
      backgroundColor: "rgba(255, 255, 255, 0.92)",
      height: diamondSize,
      marginBottom: diamondGap,
      transform: [{ rotate: "45deg" }],
      width: diamondSize,
    } satisfies ViewStyle,
    seasonIcon: {
      height: seasonIconSize,
      left: borderWidth + 1,
      position: "absolute",
      top: borderWidth + 1,
      width: seasonIconSize,
    } satisfies ImageStyle,
    weaponIcon: {
      height: weaponIconSize,
      left: (size - weaponIconSize) / 2,
      position: "absolute",
      top: Math.max(4, Math.round((innerSize - weaponIconSize - powerBarHeight) / 2)),
      width: weaponIconSize,
    } satisfies ImageStyle,
    shinyWeaponIcon: {
      opacity: 0.95,
    } satisfies ImageStyle,
    shinyOverlay: {
      backgroundColor: "rgba(232, 165, 52, 0.18)",
      height: innerSize,
      left: borderWidth,
      position: "absolute",
      top: borderWidth,
      width: innerSize,
    } satisfies ViewStyle,
    masterworkOverlay: {
      backgroundColor: "rgba(207, 176, 67, 0.12)",
      bottom: powerBarHeight + borderWidth,
      left: borderWidth,
      position: "absolute",
      right: borderWidth,
      top: borderWidth,
    } satisfies ViewStyle,
    powerBar: {
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.55)",
      bottom: 0,
      flexDirection: "row",
      height: powerBarHeight,
      justifyContent: "flex-end",
      left: 0,
      paddingHorizontal: 3,
      position: "absolute",
      right: 0,
    } satisfies ViewStyle,
    elementDot: {
      borderRadius: 2,
      height: 6,
      marginRight: 3,
      width: 6,
    } satisfies ViewStyle,
    powerText: {
      color: designTokens.colors.text,
      fontSize: Math.max(8, Math.round(size * 0.18)),
      fontWeight: designTokens.typography.fontWeight.bold,
      lineHeight: Math.max(10, Math.round(size * 0.2)),
    } satisfies TextStyle,
    fallbackGlyph: {
      color: designTokens.colors.textMuted,
      fontSize: Math.round(size * 0.34),
      fontWeight: designTokens.typography.fontWeight.bold,
      textAlign: "center",
    } satisfies TextStyle,
    fallbackGlyphContainer: {
      alignItems: "center",
      bottom: powerBarHeight,
      justifyContent: "center",
      left: 0,
      position: "absolute",
      right: 0,
      top: 0,
    } satisfies ViewStyle,
  };
}

export type WeaponTileStyles = ReturnType<typeof createWeaponTileStyles>;
