import type {
  GameMode,
  GodRollDefinition,
  InstanceDisposition,
  InventoryEvaluation,
  RankedWeaponInstance,
  WeaponDuplicateGroup,
} from "../types/god-roll.js";
import type { InventoryWeapon } from "../types/inventory.js";
import { evaluateInventory } from "./match-god-roll.js";

function compareEvaluations(left: InventoryEvaluation, right: InventoryEvaluation): number {
  if (left.result.score !== right.result.score) {
    return right.result.score - left.result.score;
  }

  if (left.weapon.power !== right.weapon.power) {
    return right.weapon.power - left.weapon.power;
  }

  if (left.weapon.isEquipped !== right.weapon.isEquipped) {
    return left.weapon.isEquipped ? -1 : 1;
  }

  return left.weapon.itemInstanceId.localeCompare(right.weapon.itemInstanceId);
}

function dispositionForInstance(
  rank: number,
  copyCount: number,
  evaluation: InventoryEvaluation,
  keeper: InventoryEvaluation,
): InstanceDisposition {
  if (copyCount === 1) {
    return "only";
  }

  if (rank === 1) {
    return "keep";
  }

  if (keeper.result.status === "perfect") {
    return "dismantle";
  }

  if (evaluation.result.score < keeper.result.score) {
    return "dismantle";
  }

  return "consider";
}

function rankInstances(evaluations: InventoryEvaluation[]): {
  keeper: InventoryEvaluation;
  instances: RankedWeaponInstance[];
} {
  const sorted = [...evaluations].sort(compareEvaluations);
  const keeper = sorted[0];
  if (!keeper) {
    throw new Error("Cannot rank an empty instance list");
  }

  const instances = sorted.map((evaluation, index) => {
    const rank = index + 1;
    return {
      rank,
      disposition: dispositionForInstance(rank, sorted.length, evaluation, keeper),
      evaluation,
    };
  });

  return { keeper, instances };
}

function compareGroups(left: WeaponDuplicateGroup, right: WeaponDuplicateGroup): number {
  if (left.copyCount !== right.copyCount) {
    return right.copyCount - left.copyCount;
  }

  if (left.keeper.result.score !== right.keeper.result.score) {
    return right.keeper.result.score - left.keeper.result.score;
  }

  return left.weaponName.localeCompare(right.weaponName);
}

function toDuplicateGroup(
  itemHash: number,
  evaluations: InventoryEvaluation[],
  mode: GameMode,
): WeaponDuplicateGroup {
  const { keeper, instances } = rankInstances(evaluations);

  return {
    itemHash,
    weaponName: keeper.weapon.name,
    ...(keeper.weapon.iconUrl ? { iconUrl: keeper.weapon.iconUrl } : {}),
    mode,
    copyCount: instances.length,
    instances,
    keeper,
  };
}

/**
 * Groups owned weapons by archetype and ranks duplicate copies so the app can
 * answer "which roll should I keep?" for the selected PVP/PVE mode.
 */
export function groupInventoryByWeapon(
  weapons: InventoryWeapon[],
  godRolls: GodRollDefinition[],
  mode: GameMode,
): WeaponDuplicateGroup[] {
  const evaluations = evaluateInventory(weapons, godRolls, mode);
  const evaluationsByHash = new Map<number, InventoryEvaluation[]>();

  for (const evaluation of evaluations) {
    const bucket = evaluationsByHash.get(evaluation.weapon.itemHash) ?? [];
    bucket.push(evaluation);
    evaluationsByHash.set(evaluation.weapon.itemHash, bucket);
  }

  const groups = [...evaluationsByHash.entries()].map(([itemHash, bucket]) =>
    toDuplicateGroup(itemHash, bucket, mode),
  );

  return groups.sort(compareGroups);
}
