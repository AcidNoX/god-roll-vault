export const GOD_ROLL_DATA_VERSION = "0.0.0";

export type GodRollMode = "pvp" | "pve";

export { isWeaponBucket, WEAPON_BUCKET_HASHES } from "./buckets.js";
export type { WeaponDefinition } from "./manifest/lookup.js";
export {
  getPerkName,
  getWeaponDefinition,
  getWeaponName,
  getWeaponTier,
} from "./manifest/lookup.js";
