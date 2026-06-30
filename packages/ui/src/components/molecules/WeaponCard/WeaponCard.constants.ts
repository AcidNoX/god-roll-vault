import type { InventoryWeapon, MatchStatus } from "@god-roll-vault/core";

import type { BadgePresentation, ElementPresentation } from "./WeaponCard.types.js";

export const badgePresentationByStatus = {
  perfect: {
    label: "God Roll",
    containerStyle: {
      backgroundColor: "#123524",
      borderColor: "#2ecc71",
    },
    textStyle: {
      color: "#b6f7cb",
    },
  },
  partial: {
    label: "Partial",
    containerStyle: {
      backgroundColor: "#3a2f12",
      borderColor: "#f5c542",
    },
    textStyle: {
      color: "#ffe7a3",
    },
  },
  missing: {
    label: "Missing",
    containerStyle: {
      backgroundColor: "#3a1717",
      borderColor: "#ff6b6b",
    },
    textStyle: {
      color: "#ffc1c1",
    },
  },
  unknown: {
    label: "Unknown",
    containerStyle: {
      backgroundColor: "#282836",
      borderColor: "#5f6472",
    },
    textStyle: {
      color: "#d6d9e0",
    },
  },
} satisfies Record<MatchStatus, BadgePresentation>;

export const elementPresentationByType = {
  kinetic: {
    label: "Kinetic",
    icon: "K",
    containerStyle: {
      backgroundColor: "#383835",
      borderColor: "#d6d3c5",
    },
    textStyle: {
      color: "#f0eee4",
    },
  },
  arc: {
    label: "Arc",
    icon: "A",
    containerStyle: {
      backgroundColor: "#12313b",
      borderColor: "#79dfff",
    },
    textStyle: {
      color: "#bdf1ff",
    },
  },
  solar: {
    label: "Solar",
    icon: "So",
    containerStyle: {
      backgroundColor: "#3d2412",
      borderColor: "#ff9f43",
    },
    textStyle: {
      color: "#ffd0a3",
    },
  },
  void: {
    label: "Void",
    icon: "V",
    containerStyle: {
      backgroundColor: "#25183d",
      borderColor: "#b084ff",
    },
    textStyle: {
      color: "#ddccff",
    },
  },
  stasis: {
    label: "Stasis",
    icon: "St",
    containerStyle: {
      backgroundColor: "#142d45",
      borderColor: "#86c5ff",
    },
    textStyle: {
      color: "#c4e4ff",
    },
  },
  strand: {
    label: "Strand",
    icon: "Sr",
    containerStyle: {
      backgroundColor: "#17331e",
      borderColor: "#7cff8a",
    },
    textStyle: {
      color: "#c8ffce",
    },
  },
  unknown: {
    label: "Unknown",
    icon: "?",
    containerStyle: {
      backgroundColor: "#282836",
      borderColor: "#5f6472",
    },
    textStyle: {
      color: "#d6d9e0",
    },
  },
} satisfies Record<InventoryWeapon["element"], ElementPresentation>;
