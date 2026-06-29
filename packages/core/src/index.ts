export const PROJECT_NAME = "god-roll-vault";

export function add(a: number, b: number): number {
  return a + b;
}

export { evaluateInventory, findBestRoll, matchGodRoll } from "./matching/match-god-roll.js";
export { perkNamesMatch } from "./matching/perk-names.js";
export {
  gameModeSchema,
  godRollDefinitionSchema,
  godRollDefinitionsSchema,
  godRollFlexSlotSchema,
  godRollPerkSlotSchema,
  godRollSlotsSchema,
  matchStatusSchema,
  weaponPerkSchema,
} from "./schemas/god-roll.js";
export type {
  DestinyCharacter,
  DestinyMembership,
} from "./types/destiny.js";
export type {
  GameMode,
  GodRollDefinition,
  GodRollFlexSlot,
  GodRollPerkSlot,
  GodRollSlots,
  InventoryEvaluation,
  InventoryWeaponRef,
  MatchStatus,
  RollMatchPerkDetail,
  RollMatchResult,
} from "./types/god-roll.js";
export { GOD_ROLL_PERK_SLOTS } from "./types/god-roll.js";
export type { InventoryWeapon, ItemLocation, WeaponElement, WeaponPerk } from "./types/inventory.js";
