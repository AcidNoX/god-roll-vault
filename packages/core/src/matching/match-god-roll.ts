import type {
  GameMode,
  GodRollDefinition,
  InventoryEvaluation,
  InventoryWeaponRef,
  RollMatchPerkDetail,
  RollMatchResult,
} from "../types/god-roll.js";
import { GOD_ROLL_PERK_SLOTS } from "../types/god-roll.js";
import type { InventoryWeapon } from "../types/inventory.js";
import { perkNamesMatch } from "./perk-names.js";
import { getAcceptablePerksForSlot, resolveGodRollSlots } from "./resolve-slots.js";

function findMatchingWeaponPerk(
  weaponPerkNames: string[],
  acceptablePerks: string[],
): string | undefined {
  for (const target of acceptablePerks) {
    const match = weaponPerkNames.find((weaponPerk) => perkNamesMatch(weaponPerk, target));
    if (match) {
      return match;
    }
  }
  return undefined;
}

function buildSlotDetails(
  definition: GodRollDefinition,
  weaponPerkNames: string[],
): RollMatchPerkDetail[] {
  const resolvedSlots = resolveGodRollSlots(definition);
  const details: RollMatchPerkDetail[] = [];

  for (const slot of GOD_ROLL_PERK_SLOTS) {
    const acceptablePerks = getAcceptablePerksForSlot(definition, slot, resolvedSlots);
    if (acceptablePerks.length === 0) {
      continue;
    }

    const primaryTarget = resolvedSlots[slot]?.[0] ?? acceptablePerks[0] ?? "";
    const matchedPerkName = findMatchingWeaponPerk(weaponPerkNames, acceptablePerks);

    details.push({
      slot,
      target: primaryTarget,
      matched: matchedPerkName !== undefined,
      ...(matchedPerkName ? { matchedPerkName } : {}),
    });
  }

  return details;
}

function scoreFromDetails(details: RollMatchPerkDetail[]): number {
  if (details.length === 0) {
    return 0;
  }

  const matchedCount = details.filter((detail) => detail.matched).length;
  return Math.round((matchedCount / details.length) * 100);
}

function statusFromScore(score: number, weaponHashMatches: boolean): RollMatchResult["status"] {
  if (!weaponHashMatches) {
    return "unknown";
  }
  if (score === 100) {
    return "perfect";
  }
  if (score > 0) {
    return "partial";
  }
  return "missing";
}

function createResult(
  weapon: InventoryWeaponRef,
  mode: GameMode,
  details: RollMatchPerkDetail[],
  weaponHashMatches: boolean,
): RollMatchResult {
  const score = weaponHashMatches ? scoreFromDetails(details) : 0;
  const matchedPerks = details.filter((detail) => detail.matched);
  const missingPerks = details.filter((detail) => !detail.matched);

  return {
    status: statusFromScore(score, weaponHashMatches),
    mode,
    weaponHash: weapon.itemHash,
    itemInstanceId: weapon.itemInstanceId,
    score,
    matchedPerks,
    missingPerks,
    details,
  };
}

function emptyResult(weapon: InventoryWeaponRef, mode: GameMode): RollMatchResult {
  return {
    status: "missing",
    mode,
    weaponHash: weapon.itemHash,
    itemInstanceId: weapon.itemInstanceId,
    score: 0,
    matchedPerks: [],
    missingPerks: [],
    details: [],
  };
}

export function matchGodRoll(
  weapon: InventoryWeaponRef,
  godRollDef: GodRollDefinition,
  mode: GameMode,
): RollMatchResult {
  const weaponHashMatches = weapon.itemHash === godRollDef.weaponHash;
  const weaponPerkNames = weapon.perks.map((perk) => perk.name);
  const details = weaponHashMatches ? buildSlotDetails(godRollDef, weaponPerkNames) : [];

  return createResult(weapon, mode, details, weaponHashMatches);
}

export function findBestRoll(
  weapon: InventoryWeaponRef,
  allGodRolls: GodRollDefinition[],
  mode: GameMode,
): RollMatchResult {
  const candidates = allGodRolls.filter(
    (definition) => definition.weaponHash === weapon.itemHash && definition.mode === mode,
  );

  if (candidates.length === 0) {
    return emptyResult(weapon, mode);
  }

  let best = matchGodRoll(weapon, candidates[0] as GodRollDefinition, mode);
  for (let index = 1; index < candidates.length; index++) {
    const candidate = matchGodRoll(weapon, candidates[index] as GodRollDefinition, mode);
    if (candidate.score > best.score) {
      best = candidate;
    }
  }

  return best;
}

export function evaluateInventory(
  weapons: InventoryWeapon[],
  godRolls: GodRollDefinition[],
  mode: GameMode,
): InventoryEvaluation[] {
  return weapons.map((weapon) => ({
    weapon,
    result: findBestRoll(weapon, godRolls, mode),
  }));
}
