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
  getWeaponTier,
  isWeaponItemHash,
  registerPlugDefinition,
  registerWeaponDefinition,
} from "./manifest/lookup.js";
