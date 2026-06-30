/** Destiny 2 weapon inventory bucket hashes (equipped slots). */
export const KINETIC_WEAPON_BUCKET = 149531261;
export const ENERGY_WEAPON_BUCKET = 2465295065;
export const POWER_WEAPON_BUCKET = 953998645;

export const WEAPON_BUCKET_HASHES = new Set<number>([
  KINETIC_WEAPON_BUCKET,
  ENERGY_WEAPON_BUCKET,
  POWER_WEAPON_BUCKET,
]);

export function isWeaponBucket(bucketHash: number): boolean {
  return WEAPON_BUCKET_HASHES.has(bucketHash);
}
