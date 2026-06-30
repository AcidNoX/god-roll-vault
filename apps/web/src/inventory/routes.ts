import type { GameMode, InventoryWeapon, WeaponPerks } from "@god-roll-vault/core";

import { readSelectedCharacter, type SelectedCharacter } from "../characters/selected-character.js";

export const GAME_MODE_OPTIONS: Array<{ mode: GameMode; label: string }> = [
  { mode: "pve", label: "PVE" },
  { mode: "pvp", label: "PVP" },
];

export function readGameModeFromSearchParams(searchParams: URLSearchParams): GameMode {
  return searchParams.get("mode") === "pvp" ? "pvp" : "pve";
}

export function readSelectionFromSearchParams(
  searchParams: URLSearchParams,
): SelectedCharacter | null {
  const membershipType = Number(searchParams.get("membershipType"));
  const membershipId = searchParams.get("membershipId");
  const characterId = searchParams.get("characterId");

  if (!Number.isFinite(membershipType) || !membershipId || !characterId) {
    return null;
  }

  return {
    membershipType,
    membershipId,
    characterId,
  };
}

export function resolveSelectedCharacter(searchParams: URLSearchParams): SelectedCharacter | null {
  return readSelectionFromSearchParams(searchParams) ?? readSelectedCharacter();
}

function buildInventorySearchParams(
  selection: SelectedCharacter | null,
  mode: GameMode,
): URLSearchParams {
  const params = new URLSearchParams();

  if (selection) {
    params.set("membershipType", String(selection.membershipType));
    params.set("membershipId", selection.membershipId);
    params.set("characterId", selection.characterId);
  }

  params.set("mode", mode);
  return params;
}

export function createInventoryPath(selection: SelectedCharacter | null, mode: GameMode): string {
  const params = buildInventorySearchParams(selection, mode);
  return `/inventory?${params.toString()}`;
}

export function createWeaponDetailPath(
  itemInstanceId: string,
  selection: SelectedCharacter | null,
  mode: GameMode,
): string {
  const params = buildInventorySearchParams(selection, mode);
  return `/weapons/${encodeURIComponent(itemInstanceId)}?${params.toString()}`;
}

export function toWeaponPerks(perks: InventoryWeapon["perks"]): WeaponPerks {
  const [barrel, magazine, perk1, perk2, originTrait] = perks;

  return {
    barrel,
    magazine,
    perk1,
    perk2,
    originTrait,
  };
}
