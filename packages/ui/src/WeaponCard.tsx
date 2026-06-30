import type { InventoryWeapon, MatchStatus, RollMatchResult } from "@god-roll-vault/core";
import type { GestureResponderEvent, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";

import { designTokens } from "./theme.js";

export type WeaponCardProps = {
  weapon: InventoryWeapon;
  matchResult?: RollMatchResult;
  onPress?: (event: GestureResponderEvent) => void;
};

type BadgePresentation = {
  label: string;
  containerStyle: ViewStyle;
  textStyle: TextStyle;
};

const badgePresentationByStatus: Record<MatchStatus, BadgePresentation> = {
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
};

const elementPresentationByType: Record<
  InventoryWeapon["element"],
  { label: string; icon: string; containerStyle: ViewStyle; textStyle: TextStyle }
> = {
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
};

const styles = {
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

export function WeaponCard({ weapon, matchResult, onPress }: WeaponCardProps) {
  const status = matchResult?.status ?? "unknown";
  const badge = badgePresentationByStatus[status];
  const element = elementPresentationByType[weapon.element] ?? elementPresentationByType.unknown;
  const cardTestID = `weapon-card-${weapon.itemInstanceId}`;

  return (
    <Pressable
      accessibilityLabel={`${weapon.name}, power ${weapon.power}, ${element.label} element, ${badge.label}`}
      accessibilityRole={onPress ? "button" : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        onPress ? styles.pressableCard : undefined,
        pressed ? styles.pressedCard : undefined,
      ]}
      testID={cardTestID}
    >
      <View
        accessibilityLabel={`${element.label} element`}
        style={[styles.elementIcon, element.containerStyle]}
        testID={`${cardTestID}-element-icon`}
      >
        <Text style={[styles.elementIconText, element.textStyle]}>{element.icon}</Text>
      </View>

      <View style={styles.weaponDetails}>
        <Text numberOfLines={1} style={styles.weaponName} testID={`${cardTestID}-name`}>
          {weapon.name}
        </Text>
        <View style={styles.metadataRow}>
          <Text style={styles.powerText} testID={`${cardTestID}-power`}>
            Power {weapon.power}
          </Text>
          <View
            accessibilityLabel={`${badge.label} match status`}
            style={[styles.badge, badge.containerStyle]}
            testID={`${cardTestID}-badge`}
          >
            <Text style={[styles.badgeText, badge.textStyle]}>{badge.label}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
