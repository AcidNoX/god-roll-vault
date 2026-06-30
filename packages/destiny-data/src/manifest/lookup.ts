import { mapBungieTierType, mapTierNameToType, type WeaponTierType } from "../tiers.js";
import mvpPlugs from "./mvp-plugs.json";
import mvpWeapons from "./mvp-weapons.json";

export const BUNGIE_ASSET_BASE_URL = "https://www.bungie.net";

export type WeaponDefinition = {
  name: string;
  tier: string;
  iconPath?: string;
  itemType?: number;
  tierType?: number;
  seasonHash?: number;
  watermarkIconPath?: string;
};

/** Bungie `DestinyItemType.Weapon` */
export const DESTINY_ITEM_TYPE_WEAPON = 3;

type ManifestWeaponEntry = WeaponDefinition;
type ManifestPlugEntry = { name: string; iconPath?: string };

const weapons = mvpWeapons as Record<string, ManifestWeaponEntry>;
const plugs = mvpPlugs as Record<string, ManifestPlugEntry>;
const runtimeWeapons: Record<string, ManifestWeaponEntry> = {};
const runtimePlugs: Record<string, ManifestPlugEntry> = {};

export function registerWeaponDefinition(itemHash: number, definition: WeaponDefinition): void {
  runtimeWeapons[String(itemHash)] = definition;
}

export function registerPlugDefinition(
  plugHash: number,
  definition: { name: string; iconPath?: string },
): void {
  runtimePlugs[String(plugHash)] = definition;
}

export function getPlugDefinition(plugHash: number): ManifestPlugEntry | undefined {
  return runtimePlugs[String(plugHash)] ?? plugs[String(plugHash)];
}

export function getWeaponDefinition(itemHash: number): WeaponDefinition | undefined {
  return runtimeWeapons[String(itemHash)] ?? weapons[String(itemHash)];
}

export function isWeaponItemHash(itemHash: number): boolean {
  const definition = getWeaponDefinition(itemHash);
  if (definition?.itemType !== undefined) {
    return definition.itemType === DESTINY_ITEM_TYPE_WEAPON;
  }

  // Curated MVP manifest entries are weapons only.
  return definition !== undefined;
}

export function getWeaponName(itemHash: number): string {
  return getWeaponDefinition(itemHash)?.name ?? `Unknown Weapon (${itemHash})`;
}

export function getWeaponTier(itemHash: number): string {
  return getWeaponDefinition(itemHash)?.tier ?? "Unknown";
}

export function getBungieAssetUrl(path: string | undefined): string | undefined {
  if (!path) {
    return undefined;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${BUNGIE_ASSET_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getWeaponIconUrl(itemHash: number): string | undefined {
  return getBungieAssetUrl(getWeaponDefinition(itemHash)?.iconPath);
}

export function getWeaponWatermarkIconUrl(itemHash: number): string | undefined {
  return getBungieAssetUrl(getWeaponDefinition(itemHash)?.watermarkIconPath);
}

export function getWeaponTierType(itemHash: number): WeaponTierType {
  const definition = getWeaponDefinition(itemHash);
  if (definition?.tierType !== undefined) {
    return mapBungieTierType(definition.tierType);
  }

  return mapTierNameToType(definition?.tier);
}

export function getWeaponSeasonHash(itemHash: number): number | undefined {
  return getWeaponDefinition(itemHash)?.seasonHash;
}

export function getPerkName(plugHash: number): string {
  return getPlugDefinition(plugHash)?.name ?? `Unknown Perk (${plugHash})`;
}

export function getPerkIconUrl(plugHash: number): string | undefined {
  return getBungieAssetUrl(getPlugDefinition(plugHash)?.iconPath);
}
