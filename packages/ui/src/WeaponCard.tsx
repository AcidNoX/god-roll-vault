import type { InventoryWeapon, MatchStatus, RollMatchResult } from "@god-roll-vault/core";
import type { GestureResponderEvent, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";

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
};

const elementPresentationByType: Record<
  InventoryWeapon["element"],
  { label: string; icon: string; containerStyle: ViewStyle; textStyle: TextStyle }
> = {
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
};

const styles = {
  card: {
    alignItems: "center",
    backgroundColor: "#151520",
    borderColor: "#2a2a3a",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 72,
    paddingHorizontal: 12,
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
    borderRadius: 16,
    borderWidth: 1,
    height: 32,
    justifyContent: "center",
    marginRight: 12,
    width: 32,
  } satisfies ViewStyle,
  elementIconText: {
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 14,
  } satisfies TextStyle,
  weaponDetails: {
    flex: 1,
    minWidth: 0,
  } satisfies ViewStyle,
  weaponName: {
    color: "#f5f5f5",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 21,
  } satisfies TextStyle,
  metadataRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 4,
  } satisfies ViewStyle,
  powerText: {
    color: "#b9bbc9",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  } satisfies TextStyle,
  badge: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: "center",
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  } satisfies ViewStyle,
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
    lineHeight: 14,
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
