export const GOD_ROLL_DATA_VERSION = "0.0.0";

export type GodRollMode = "pvp" | "pve";

export { isWeaponBucket, WEAPON_BUCKET_HASHES } from "./buckets.js";
export {
  createGodRollDefinitions,
  godRollDefinitions,
  godRollEntries,
} from "./god-rolls/definitions.js";
export type {
  GodRollEntry,
  GodRollPerkSlot,
  GodRollPerks,
  GodRollRoll,
} from "./god-rolls/schema.js";
export {
  GOD_ROLL_PERK_SLOTS,
  godRollEntrySchema,
  godRollPerkSlotSchema,
  godRollPerksSchema,
  godRollRollSchema,
} from "./god-rolls/schema.js";
export {
  DESTINY_ITEM_STATE_CRAFTED,
  DESTINY_ITEM_STATE_HAS_SHINY,
  DESTINY_ITEM_STATE_MASTERWORK,
  hasItemStateFlag,
} from "./item-state.js";
export type { WeaponDefinition } from "./manifest/lookup.js";
export {
  BUNGIE_ASSET_BASE_URL,
  DESTINY_ITEM_TYPE_WEAPON,
  getBungieAssetUrl,
  getPerkIconUrl,
  getPerkName,
  getPlugDefinition,
  getWeaponDefinition,
  getWeaponIconUrl,
  getWeaponName,
  getWeaponSeasonHash,
  getWeaponTier,
  getWeaponTierType,
  getWeaponWatermarkIconUrl,
  isWeaponItemHash,
  registerPlugDefinition,
  registerWeaponDefinition,
} from "./manifest/lookup.js";
export type { SeasonDefinition } from "./seasons/lookup.js";
export {
  getSeasonDefinition,
  getSeasonIconUrl,
  registerSeasonDefinition,
} from "./seasons/lookup.js";
export type { WeaponTierType } from "./tiers.js";
export {
  BUNGIE_TIER_TYPE,
  getTierBackgroundColor,
  getTierDiamondCount,
  mapBungieTierType,
  mapTierNameToType,
} from "./tiers.js";
