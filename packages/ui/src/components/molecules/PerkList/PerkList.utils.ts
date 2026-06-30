import type { RollMatchResult, WeaponPerks } from "@god-roll-vault/core";

import { perkListSlots } from "./PerkList.constants.js";
import type { PerkListItem, PerkListSlotKey, PerkListSlotStatus } from "./PerkList.types.js";

function getStatusForSlot(
  slot: PerkListSlotKey,
  detailBySlot: Map<PerkListSlotKey, RollMatchResult["details"][number]>,
): PerkListSlotStatus {
  const detail = detailBySlot.get(slot);

  if (!detail) {
    return "neutral";
  }

  return detail.matched ? "matched" : "missing";
}

export function createPerkListItems(
  perks: WeaponPerks,
  matchResult: RollMatchResult,
): PerkListItem[] {
  const detailBySlot: Map<PerkListSlotKey, RollMatchResult["details"][number]> = new Map(
    matchResult.details.map((detail) => [detail.slot, detail]),
  );

  return perkListSlots.map((slot) => {
    const detail = detailBySlot.get(slot.key);
    return {
      key: slot.key,
      label: slot.label,
      perk: perks[slot.key],
      target: detail?.target,
      status: getStatusForSlot(slot.key, detailBySlot),
    };
  });
}

export function getPerkListValue(item: PerkListItem): string {
  if (item.perk) {
    return item.perk.name;
  }

  if (item.status === "missing" && item.target) {
    return `Missing ${item.target}`;
  }

  return "Not equipped";
}
