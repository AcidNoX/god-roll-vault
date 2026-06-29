import type { WeaponPerk } from "./inventory.js";

export type GameMode = "pvp" | "pve";

export type MatchStatus = "perfect" | "partial" | "missing" | "unknown";

/** Target perk combo for a weapon hash, loaded from curated god-roll data. */
export type GodRollDefinition = {
  weaponHash: number;
  mode: GameMode;
  perks: WeaponPerk[];
};

export type RollMatchPerkDetail = {
  target: WeaponPerk;
  matched: boolean;
};

/** Result of comparing an owned weapon roll against a god roll definition. */
export type RollMatchResult = {
  status: MatchStatus;
  mode: GameMode;
  weaponHash: number;
  itemInstanceId?: string;
  details: RollMatchPerkDetail[];
};
