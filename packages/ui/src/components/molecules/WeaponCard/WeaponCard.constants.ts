import type { InventoryWeapon, MatchStatus } from "@god-roll-vault/core";

import { designTokens } from "../../../theme/index.js";
import type { BadgePresentation, ElementPresentation } from "./WeaponCard.types.js";

export const badgePresentationByStatus = {
  perfect: {
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
    label: "Missing",
    containerStyle: {
      backgroundColor: designTokens.colors.badge.missing.background,
      borderColor: designTokens.colors.badge.missing.border,
    },
    textStyle: {
      color: designTokens.colors.badge.missing.text,
    },
  },
  unknown: {
    label: "Unknown",
    containerStyle: {
      backgroundColor: designTokens.colors.badge.unknown.background,
      borderColor: designTokens.colors.badge.unknown.border,
    },
    textStyle: {
      color: designTokens.colors.badge.unknown.text,
    },
  },
} satisfies Record<MatchStatus, BadgePresentation>;

export const elementPresentationByType = {
  kinetic: {
    label: "Kinetic",
    icon: "K",
    containerStyle: {
      backgroundColor: designTokens.colors.element.kinetic.background,
      borderColor: designTokens.colors.element.kinetic.border,
    },
    textStyle: {
      color: designTokens.colors.element.kinetic.text,
    },
  },
  arc: {
    label: "Arc",
    icon: "A",
    containerStyle: {
      backgroundColor: designTokens.colors.element.arc.background,
      borderColor: designTokens.colors.element.arc.border,
    },
    textStyle: {
      color: designTokens.colors.element.arc.text,
    },
  },
  solar: {
    label: "Solar",
    icon: "So",
    containerStyle: {
      backgroundColor: designTokens.colors.element.solar.background,
      borderColor: designTokens.colors.element.solar.border,
    },
    textStyle: {
      color: designTokens.colors.element.solar.text,
    },
  },
  void: {
    label: "Void",
    icon: "V",
    containerStyle: {
      backgroundColor: designTokens.colors.element.void.background,
      borderColor: designTokens.colors.element.void.border,
    },
    textStyle: {
      color: designTokens.colors.element.void.text,
    },
  },
  stasis: {
    label: "Stasis",
    icon: "St",
    containerStyle: {
      backgroundColor: designTokens.colors.element.stasis.background,
      borderColor: designTokens.colors.element.stasis.border,
    },
    textStyle: {
      color: designTokens.colors.element.stasis.text,
    },
  },
  strand: {
    label: "Strand",
    icon: "Sr",
    containerStyle: {
      backgroundColor: designTokens.colors.element.strand.background,
      borderColor: designTokens.colors.element.strand.border,
    },
    textStyle: {
      color: designTokens.colors.element.strand.text,
    },
  },
  unknown: {
    label: "Unknown",
    icon: "?",
    containerStyle: {
      backgroundColor: designTokens.colors.element.unknown.background,
      borderColor: designTokens.colors.element.unknown.border,
    },
    textStyle: {
      color: designTokens.colors.element.unknown.text,
    },
  },
} satisfies Record<InventoryWeapon["element"], ElementPresentation>;
