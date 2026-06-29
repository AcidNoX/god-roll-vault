import mvpPlugs from "./mvp-plugs.json";
import mvpWeapons from "./mvp-weapons.json";

export type WeaponDefinition = {
  name: string;
  tier: string;
};

type ManifestWeaponEntry = WeaponDefinition;
type ManifestPlugEntry = { name: string };

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

export function getPerkName(plugHash: number): string {
  return plugs[String(plugHash)]?.name ?? `Unknown Perk (${plugHash})`;
}
