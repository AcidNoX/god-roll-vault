import { Pressable, Text, View } from "react-native";

import { Image } from "../../atoms/Image/index.js";
import {
  badgePresentationByStatus,
  dispositionPresentationByType,
  elementPresentationByType,
} from "./WeaponCard.constants.js";
import { weaponCardStyles } from "./WeaponCard.styles.js";
import type { WeaponCardProps } from "./WeaponCard.types.js";

export function WeaponCard({ weapon, matchResult, disposition, onPress }: WeaponCardProps) {
  const status = matchResult?.status ?? "unknown";
  const badge = badgePresentationByStatus[status];
  const dispositionBadge =
    disposition && disposition !== "only" ? dispositionPresentationByType[disposition] : undefined;
  const element = elementPresentationByType[weapon.element] ?? elementPresentationByType.unknown;
  const cardTestID = `weapon-card-${weapon.itemInstanceId}`;

  return (
    <Pressable
      accessibilityLabel={`${weapon.name}, power ${weapon.power}, ${element.label} element, ${badge.label}`}
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
      {weapon.iconUrl ? (
        <View
          accessibilityLabel={`${weapon.name} icon`}
          style={weaponCardStyles.assetIcon}
          testID={`${cardTestID}-weapon-icon`}
        >
          <Image
            accessibilityLabel={`${weapon.name} icon`}
            sourceUri={weapon.iconUrl}
            style={weaponCardStyles.weaponIconImage}
            testID={`${cardTestID}-weapon-icon-image`}
          />
        </View>
      ) : (
        <View
          accessibilityLabel={`${element.label} element`}
          style={[
            weaponCardStyles.elementIcon,
            weaponCardStyles.fallbackElementIcon,
            element.containerStyle,
          ]}
          testID={`${cardTestID}-element-icon`}
        >
          <Text style={[weaponCardStyles.elementIconText, element.textStyle]}>{element.icon}</Text>
        </View>
      )}

      <View style={weaponCardStyles.weaponDetails}>
        <Text numberOfLines={1} style={weaponCardStyles.weaponName} testID={`${cardTestID}-name`}>
          {weapon.name}
        </Text>
        <View style={weaponCardStyles.metadataRow}>
          <Text style={weaponCardStyles.powerText} testID={`${cardTestID}-power`}>
            Power {weapon.power}
          </Text>
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
