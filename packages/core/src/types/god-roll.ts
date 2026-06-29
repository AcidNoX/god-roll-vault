import type { InventoryWeapon, WeaponPerk } from "./inventory.js";

export type GameMode = "pvp" | "pve";

export type MatchStatus = "perfect" | "partial" | "missing" | "unknown";

export type GodRollPerkSlot = "barrel" | "magazine" | "perk1" | "perk2";

export const GOD_ROLL_PERK_SLOTS: readonly GodRollPerkSlot[] = [
  "barrel",
  "magazine",
  "perk1",
  "perk2",
] as const;

/** Named perk columns for a god roll (values are acceptable perk names). */
export type GodRollSlots = Partial<Record<GodRollPerkSlot, string[]>>;

/** Alternate acceptable perks for a specific slot. */
export type GodRollFlexSlot = {
  slot: GodRollPerkSlot;
  perks: string[];
};

/** Target perk combo for a weapon hash, loaded from curated god-roll data. */
export type GodRollDefinition = {
  weaponHash: number;
  mode: GameMode;
  label?: string;
  slots?: GodRollSlots;
  flexSlots?: GodRollFlexSlot[];
  /** Legacy flat perk list; mapped to slots in slot order when `slots` is empty. */
  perks?: WeaponPerk[];
};

export type RollMatchPerkDetail = {
  slot: GodRollPerkSlot;
  target: string;
  matched: boolean;
  matchedPerkName?: string;
};

/** Result of comparing an owned weapon roll against a god roll definition. */
export type RollMatchResult = {
  status: MatchStatus;
  mode: GameMode;
  weaponHash: number;
  itemInstanceId?: string;
  score: number;
  matchedPerks: RollMatchPerkDetail[];
  missingPerks: RollMatchPerkDetail[];
  details: RollMatchPerkDetail[];
};

export type InventoryEvaluation = {
  weapon: InventoryWeapon;
  result: RollMatchResult;
};

/** Minimal weapon shape used by matching functions. */
export type InventoryWeaponRef = {
  itemHash: number;
  itemInstanceId: string;
  perks: WeaponPerk[];
};
