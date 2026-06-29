/** Destiny 2 weapon inventory bucket hashes. */
export const WEAPON_BUCKET_HASHES = new Set<number>([
  149531261, // Kinetic Weapons
  2465295065, // Energy Weapons
  953998645, // Power Weapons
]);

export function isWeaponBucket(bucketHash: number): boolean {
  return WEAPON_BUCKET_HASHES.has(bucketHash);
}
