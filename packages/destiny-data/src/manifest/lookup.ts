import mvpPlugs from "./mvp-plugs.json";
import mvpWeapons from "./mvp-weapons.json";

export const BUNGIE_ASSET_BASE_URL = "https://www.bungie.net";

export type WeaponDefinition = {
  name: string;
  tier: string;
  iconPath?: string;
};

type ManifestWeaponEntry = WeaponDefinition;
type ManifestPlugEntry = { name: string; iconPath?: string };

const weapons = mvpWeapons as Record<string, ManifestWeaponEntry>;
const plugs = mvpPlugs as Record<string, ManifestPlugEntry>;

export function getWeaponDefinition(itemHash: number): WeaponDefinition | undefined {
  return weapons[String(itemHash)];
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

export function getPerkName(plugHash: number): string {
  return plugs[String(plugHash)]?.name ?? `Unknown Perk (${plugHash})`;
}

export function getPerkIconUrl(plugHash: number): string | undefined {
  return getBungieAssetUrl(plugs[String(plugHash)]?.iconPath);
}
