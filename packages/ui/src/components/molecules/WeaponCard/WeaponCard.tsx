import { Pressable, Text, View } from "react-native";
import { WeaponTile } from "../WeaponTile/WeaponTile.js";
import {
  badgePresentationByStatus,
  dispositionPresentationByType,
} from "./WeaponCard.constants.js";
import { weaponCardStyles } from "./WeaponCard.styles.js";
import type { WeaponCardProps } from "./WeaponCard.types.js";

export function WeaponCard({ weapon, matchResult, disposition, onPress }: WeaponCardProps) {
  const status = matchResult?.status ?? "unknown";
  const badge = badgePresentationByStatus[status];
  const dispositionBadge =
    disposition && disposition !== "only" ? dispositionPresentationByType[disposition] : undefined;
  const cardTestID = `weapon-card-${weapon.itemInstanceId}`;

  return (
    <Pressable
      accessibilityLabel={`${weapon.name}, power ${weapon.power}, ${badge.label}`}
      accessibilityRole={onPress ? "button" : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        weaponCardStyles.card,
        onPress ? weaponCardStyles.pressableCard : undefined,
        pressed ? weaponCardStyles.pressedCard : undefined,
      ]}
      testID={cardTestID}
    >
      <View style={weaponCardStyles.tileContainer} testID={`${cardTestID}-tile`}>
        <WeaponTile testID={`${cardTestID}-weapon-tile`} weapon={weapon} />
      </View>

      <View style={weaponCardStyles.weaponDetails}>
        <Text numberOfLines={1} style={weaponCardStyles.weaponName} testID={`${cardTestID}-name`}>
          {weapon.name}
        </Text>
        <View style={weaponCardStyles.metadataRow}>
          {status !== "unknown" ? (
            <View
              accessibilityLabel={`${badge.label} match status`}
              style={[weaponCardStyles.badge, badge.containerStyle]}
              testID={`${cardTestID}-badge`}
            >
              <Text style={[weaponCardStyles.badgeText, badge.textStyle]}>{badge.label}</Text>
            </View>
          ) : null}
          {dispositionBadge ? (
            <View
              accessibilityLabel={`${dispositionBadge.label} recommendation`}
              style={[weaponCardStyles.badge, dispositionBadge.containerStyle]}
              testID={`${cardTestID}-disposition`}
            >
              <Text style={[weaponCardStyles.badgeText, dispositionBadge.textStyle]}>
                {dispositionBadge.label}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
