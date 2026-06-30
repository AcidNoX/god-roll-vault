import type { GameMode, MatchStatus } from "@god-roll-vault/core";

import { designTokens } from "../../../theme/index.js";
import type { GodRollBadgePresentation } from "./GodRollBadge.types.js";

export const gameModeLabels = {
  pve: "PVE",
  pvp: "PVP",
} satisfies Record<GameMode, string>;

export const godRollBadgePresentationByStatus = {
  perfect: {
    accessibilityDescription: "perfect god roll match",
    label: "God Roll",
    containerStyle: {
      backgroundColor: designTokens.colors.badge.perfect.background,
      borderColor: designTokens.colors.badge.perfect.border,
    },
    textStyle: {
      color: designTokens.colors.badge.perfect.text,
    },
  },
  partial: {
    accessibilityDescription: "partial god roll match",
    label: "Partial",
    containerStyle: {
      backgroundColor: designTokens.colors.badge.partial.background,
      borderColor: designTokens.colors.badge.partial.border,
    },
    textStyle: {
      color: designTokens.colors.badge.partial.text,
    },
  },
  missing: {
    accessibilityDescription: "missing god roll match",
    label: "Missing",
    containerStyle: {
      backgroundColor: designTokens.colors.surfaceMuted,
      borderColor: designTokens.colors.borderStrong,
    },
    textStyle: {
      color: designTokens.colors.textMuted,
    },
  },
  unknown: {
    accessibilityDescription: "unknown god roll match",
    label: "Unknown",
    containerStyle: {
      backgroundColor: designTokens.colors.badge.unknown.background,
      borderColor: designTokens.colors.badge.unknown.border,
      borderStyle: "dotted",
    },
    textStyle: {
      color: designTokens.colors.badge.unknown.text,
    },
  },
} satisfies Record<MatchStatus, GodRollBadgePresentation>;
