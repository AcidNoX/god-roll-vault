import type { GodRollDefinition, GodRollPerkSlot, GodRollSlots } from "../types/god-roll.js";
import { GOD_ROLL_PERK_SLOTS } from "../types/god-roll.js";

export function resolveGodRollSlots(definition: GodRollDefinition): GodRollSlots {
  const fromSlots = definition.slots ?? {};
  const hasNamedSlots = GOD_ROLL_PERK_SLOTS.some((slot) => (fromSlots[slot]?.length ?? 0) > 0);

  if (hasNamedSlots) {
    return fromSlots;
  }

  if (!definition.perks?.length) {
    return fromSlots;
  }

  const mapped: GodRollSlots = {};
  for (
    let index = 0;
    index < definition.perks.length && index < GOD_ROLL_PERK_SLOTS.length;
    index++
  ) {
    const slot = GOD_ROLL_PERK_SLOTS[index] as GodRollPerkSlot;
    mapped[slot] = [definition.perks[index]?.name ?? ""];
  }

  return mapped;
}

export function getAcceptablePerksForSlot(
  definition: GodRollDefinition,
  slot: GodRollPerkSlot,
  resolvedSlots: GodRollSlots,
): string[] {
  const primary = resolvedSlots[slot] ?? [];
  const flex =
    definition.flexSlots?.filter((entry) => entry.slot === slot).flatMap((entry) => entry.perks) ??
    [];
  return [...primary, ...flex];
}
