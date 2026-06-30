import { designTokens } from "../../../theme/index.js";
import type {
  PerkListSlotDefinition,
  PerkListSlotPresentation,
  PerkListSlotStatus,
} from "./PerkList.types.js";

export const perkListSlots = [
  { key: "barrel", label: "Barrel" },
  { key: "magazine", label: "Mag" },
  { key: "perk1", label: "Perk 1" },
  { key: "perk2", label: "Perk 2" },
  { key: "originTrait", label: "Origin Trait" },
] satisfies PerkListSlotDefinition[];

export const perkListPresentationByStatus = {
  matched: {
    statusLabel: "Matched",
    containerStyle: {
      backgroundColor: designTokens.colors.element.strand.background,
      borderColor: designTokens.colors.element.strand.border,
    },
    labelStyle: {
      color: designTokens.colors.element.strand.text,
    },
    valueStyle: {
      color: designTokens.colors.text,
    },
    statusStyle: {
      color: designTokens.colors.element.strand.text,
    },
  },
  missing: {
    statusLabel: "Missing",
    containerStyle: {
      backgroundColor: designTokens.colors.badge.missing.background,
      borderColor: designTokens.colors.badge.missing.border,
    },
    labelStyle: {
      color: designTokens.colors.badge.missing.text,
    },
    valueStyle: {
      color: designTokens.colors.text,
    },
    statusStyle: {
      color: designTokens.colors.badge.missing.text,
    },
  },
  neutral: {
    statusLabel: "Optional",
    containerStyle: {
      backgroundColor: designTokens.colors.surfaceMuted,
      borderColor: designTokens.colors.border,
    },
    labelStyle: {
      color: designTokens.colors.textMuted,
    },
    valueStyle: {
      color: designTokens.colors.text,
    },
    statusStyle: {
      color: designTokens.colors.textSubtle,
    },
  },
} satisfies Record<PerkListSlotStatus, PerkListSlotPresentation>;
