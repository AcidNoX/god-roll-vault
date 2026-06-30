import { Text, View } from "react-native";

import { Image } from "../../atoms/Image/index.js";
import { elementPresentationByType } from "../WeaponCard/WeaponCard.constants.js";
import {
  DEFAULT_WEAPON_TILE_SIZE,
  getTileBackgroundColor,
  getTileDiamondCount,
  getTileElementAccent,
  resolveWeaponTierType,
} from "./WeaponTile.constants.js";
import { createWeaponTileStyles } from "./WeaponTile.styles.js";
import type { WeaponTileProps } from "./WeaponTile.types.js";

export function WeaponTile({
  weapon,
  size = DEFAULT_WEAPON_TILE_SIZE,
  selected = false,
  testID,
}: WeaponTileProps) {
  const tileTestID = testID ?? `weapon-tile-${weapon.itemInstanceId}`;
  const tierType = resolveWeaponTierType(weapon);
  const styles = createWeaponTileStyles(size);
  const diamondCount = getTileDiamondCount(tierType);
  const element = elementPresentationByType[weapon.element] ?? elementPresentationByType.unknown;

  return (
    <View
      accessibilityLabel={`${weapon.name}, power ${weapon.power}`}
      style={[
        styles.tile,
        { backgroundColor: getTileBackgroundColor(tierType) },
        tierType === "exotic" ? styles.exoticBorder : undefined,
        selected ? styles.selectedBorder : undefined,
      ]}
      testID={tileTestID}
    >
      {weapon.watermarkIconUrl ? (
        <Image
          accessibilityLabel={`${weapon.name} season watermark`}
          resizeMode="cover"
          sourceUri={weapon.watermarkIconUrl}
          style={styles.watermark}
          testID={`${tileTestID}-watermark`}
        />
      ) : null}

      {diamondCount > 0 ? (
        <View style={styles.tierDiamonds} testID={`${tileTestID}-tier-diamonds`}>
          {Array.from({ length: diamondCount }, (_, index) => (
            <View key={`diamond-${index}`} style={styles.tierDiamond} />
          ))}
        </View>
      ) : null}

      {weapon.seasonIconUrl ? (
        <Image
          accessibilityLabel={`${weapon.name} season icon`}
          sourceUri={weapon.seasonIconUrl}
          style={styles.seasonIcon}
          testID={`${tileTestID}-season-icon`}
        />
      ) : null}

      {weapon.isMasterwork ? <View style={styles.masterworkOverlay} /> : null}

      {weapon.iconUrl ? (
        <Image
          accessibilityLabel={`${weapon.name} icon`}
          resizeMode="contain"
          sourceUri={weapon.iconUrl}
          style={[styles.weaponIcon, weapon.isShiny ? styles.shinyWeaponIcon : undefined]}
          testID={`${tileTestID}-weapon-icon`}
        />
      ) : (
        <View style={styles.fallbackGlyphContainer}>
          <Text style={styles.fallbackGlyph}>{element.icon}</Text>
        </View>
      )}

      {weapon.isShiny ? (
        <View style={styles.shinyOverlay} testID={`${tileTestID}-shiny-overlay`} />
      ) : null}

      <View style={styles.powerBar} testID={`${tileTestID}-power-bar`}>
        <View
          style={[styles.elementDot, { backgroundColor: getTileElementAccent(weapon.element) }]}
          testID={`${tileTestID}-element-dot`}
        />
        <Text style={styles.powerText} testID={`${tileTestID}-power`}>
          {weapon.power}
        </Text>
      </View>
    </View>
  );
}
