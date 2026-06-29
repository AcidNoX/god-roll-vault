export const GOD_ROLL_DATA_VERSION = "0.0.0";

export type GodRollMode = "pvp" | "pve";

export { isWeaponBucket, WEAPON_BUCKET_HASHES } from "./buckets.js";
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
  getPerkName,
  getWeaponDefinition,
  getWeaponName,
  getWeaponTier,
} from "./manifest/lookup.js";
