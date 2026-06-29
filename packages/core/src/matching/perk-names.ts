/** Perk name comparison is case-insensitive. Enhanced perks match their base name. */
export function normalizePerkName(name: string): string {
  return name.trim().toLowerCase();
}

export function stripEnhancedPrefix(normalizedName: string): string {
  const prefix = "enhanced ";
  if (normalizedName.startsWith(prefix)) {
    return normalizedName.slice(prefix.length);
  }
  return normalizedName;
}

export function perkNamesMatch(weaponPerkName: string, targetPerkName: string): boolean {
  const weapon = stripEnhancedPrefix(normalizePerkName(weaponPerkName));
  const target = stripEnhancedPrefix(normalizePerkName(targetPerkName));
  return weapon === target;
}
