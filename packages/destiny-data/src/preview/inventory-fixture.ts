import type { GameMode, InventoryWeapon, WeaponPerk } from "@god-roll-vault/core";
import { ENERGY_WEAPON_BUCKET, KINETIC_WEAPON_BUCKET, POWER_WEAPON_BUCKET } from "../buckets.js";
import {
  getPerkIconUrl,
  getPerkName,
  getWeaponIconUrl,
  getWeaponName,
  getWeaponTier,
} from "../manifest/lookup.js";
import mvpPlugs from "../manifest/mvp-plugs.json";

const plugs = mvpPlugs as Record<string, { name: string; iconPath?: string }>;

export const PREVIEW_CHARACTER = {
  className: "Titan",
  power: 1985,
} as const;

export const PREVIEW_MODE: GameMode = "pvp";

export const PREVIEW_SELECTED_INSTANCE_ID = "preview-fatebringer";

function perk(plugHash: number): WeaponPerk {
  const perk: WeaponPerk = {
    plugHash,
    name: getPerkName(plugHash),
  };
  const iconUrl = getPerkIconUrl(plugHash);
  return iconUrl ? { ...perk, iconUrl } : perk;
}

function perkByName(name: string): WeaponPerk {
  const entry = Object.entries(plugs).find(([, definition]) => definition.name === name);
  if (!entry) {
    throw new Error(`Preview fixture: no plug hash for perk "${name}"`);
  }
  return perk(Number(entry[0]));
}

function weapon(
  itemHash: number,
  itemInstanceId: string,
  bucketHash: number,
  element: InventoryWeapon["element"],
  power: number,
  perks: WeaponPerk[],
  isEquipped = true,
): InventoryWeapon {
  const base: InventoryWeapon = {
    itemHash,
    itemInstanceId,
    name: getWeaponName(itemHash),
    tier: getWeaponTier(itemHash),
    power,
    element,
    perks,
    location: "character",
    bucketHash,
    isEquipped,
  };
  const iconUrl = getWeaponIconUrl(itemHash);
  return iconUrl ? { ...base, iconUrl } : base;
}

/** Static equipped loadout for design/previews — perk order matches `toWeaponPerks` in the web app. */
export const previewInventoryWeapons: InventoryWeapon[] = [
  weapon(4219826183, "preview-fatebringer-keeper", KINETIC_WEAPON_BUCKET, "kinetic", 1812, [
    perk(1482024992), // Smallbore
    perk(3142289711), // Accurized Rounds
    perk(1015611457), // Kill Clip
    perk(3824105627), // Firefly
  ]),
  weapon(4219826183, PREVIEW_SELECTED_INSTANCE_ID, KINETIC_WEAPON_BUCKET, "kinetic", 1810, [
    perk(4090651448), // Corkscrew Rifling
    perk(3142289711), // Accurized Rounds
    perk(1015611457), // Kill Clip
    perk(3824105627), // Firefly
  ]),
  weapon(4219826183, "preview-fatebringer-junk", KINETIC_WEAPON_BUCKET, "kinetic", 1802, [
    perk(4090651448), // Corkscrew Rifling
    perk(3142289711), // Accurized Rounds
    perk(1015611457), // Kill Clip
    perkByName("Rampage"),
  ]),
  weapon(2429822977, "preview-austringer", KINETIC_WEAPON_BUCKET, "void", 1805, [
    perkByName("Arrowhead Brake"),
    perkByName("Accurized Rounds"),
    perkByName("Kill Clip"),
    perkByName("Moving Target"),
  ]),
  weapon(400096939, "preview-outbreak", KINETIC_WEAPON_BUCKET, "arc", 1798, [
    perkByName("Fluted Barrel"),
    perkByName("Accurized Rounds"),
    perkByName("Outlaw"),
    perkByName("Firefly"),
  ]),
  weapon(46524085, "preview-osteo", KINETIC_WEAPON_BUCKET, "solar", 1812, []),
  weapon(2357297366, "preview-witherhoard", KINETIC_WEAPON_BUCKET, "void", 1780, []),
  weapon(3089417789, "preview-riskrunner", KINETIC_WEAPON_BUCKET, "arc", 1760, []),
  weapon(1481892490, "preview-palindrome", ENERGY_WEAPON_BUCKET, "solar", 1810, [
    perkByName("Arrowhead Brake"),
    perkByName("Accurized Rounds"),
    perkByName("Kill Clip"),
    perkByName("Rampage"),
  ]),
  weapon(4190932264, "preview-beloved", ENERGY_WEAPON_BUCKET, "void", 1802, [
    perkByName("Arrowhead Brake"),
    perkByName("Accurized Rounds"),
    perkByName("Snapshot Sights"),
    perkByName("Moving Target"),
  ]),
  weapon(613334176, "preview-forbearance", ENERGY_WEAPON_BUCKET, "arc", 1790, [
    perkByName("Corkscrew Rifling"),
    perkByName("Accurized Rounds"),
    perkByName("Auto-Loading Holster"),
    perkByName("Demolitionist"),
  ]),
  weapon(882778888, "preview-rose", ENERGY_WEAPON_BUCKET, "solar", 1808, [
    perkByName("Hammer-Forged Rifling"),
    perkByName("Accurized Rounds"),
    perkByName("Kill Clip"),
    perkByName("Outlaw"),
  ]),
  weapon(4255171531, "preview-hothead", POWER_WEAPON_BUCKET, "solar", 1810, [
    perkByName("Corkscrew Rifling"),
    perkByName("Accurized Rounds"),
    perkByName("Auto-Loading Holster"),
    perkByName("Demolitionist"),
  ]),
  weapon(3652506829, "preview-stormchaser", POWER_WEAPON_BUCKET, "arc", 1795, [
    perkByName("Fluted Barrel"),
    perkByName("Accurized Rounds"),
    perkByName("Auto-Loading Holster"),
    perkByName("Demolitionist"),
  ]),
  weapon(2886339027, "preview-cataclysmic", POWER_WEAPON_BUCKET, "solar", 1800, [
    perkByName("Fluted Barrel"),
    perkByName("Accurized Rounds"),
    perkByName("Auto-Loading Holster"),
    perkByName("Demolitionist"),
  ]),
  weapon(614426548, "preview-falling-guillotine", POWER_WEAPON_BUCKET, "void", 1818, [
    perkByName("Corkscrew Rifling"),
    perkByName("Accurized Rounds"),
    perkByName("Demolitionist"),
    perkByName("Vorpal Weapon"),
  ]),
];
