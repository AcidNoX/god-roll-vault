export const PROJECT_NAME = "god-roll-vault";

export function add(a: number, b: number): number {
  return a + b;
}

export {
  gameModeSchema,
  godRollDefinitionSchema,
  godRollDefinitionsSchema,
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
  MatchStatus,
  RollMatchPerkDetail,
  RollMatchResult,
} from "./types/god-roll.js";
export type { InventoryWeapon, ItemLocation, WeaponPerk } from "./types/inventory.js";
