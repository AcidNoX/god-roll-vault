import type {
  GodRollPerkSlot as CoreGodRollPerkSlot,
  GameMode,
  GodRollDefinition,
  GodRollFlexSlot,
  GodRollSlots,
} from "@god-roll-vault/core";

import austringer from "./austringer.json";
import beloved from "./beloved.json";
import blastFurnace from "./blast-furnace.json";
import cataclysmic from "./cataclysmic.json";
import deadMansTale from "./dead-mans-tale.json";
import deliverance from "./deliverance.json";
import eyasluna from "./eyasluna.json";
import fallingGuillotine from "./falling-guillotine.json";
import fatebringer from "./fatebringer.json";
import forbearance from "./forbearance.json";
import hammerhead from "./hammerhead.json";
import igneousHammer from "./igneous-hammer.json";
import outbreakPerfected from "./outbreak-perfected.json";
import rose from "./rose.json";
import { type GodRollEntry, type GodRollPerkSlot, godRollEntrySchema } from "./schema.js";
import stormchaser from "./stormchaser.json";
import theHothead from "./the-hothead.json";
import theMountaintop from "./the-mountaintop.json";
import thePalindrome from "./the-palindrome.json";
import theRecluse from "./the-recluse.json";
import witherhoard from "./witherhoard.json";

const CORE_GOD_ROLL_PERK_SLOTS = ["barrel", "magazine", "perk1", "perk2"] as const;

const rawGodRollEntries = [
  austringer,
  beloved,
  blastFurnace,
  cataclysmic,
  deadMansTale,
  deliverance,
  eyasluna,
  fallingGuillotine,
  fatebringer,
  forbearance,
  hammerhead,
  igneousHammer,
  outbreakPerfected,
  rose,
  stormchaser,
  theHothead,
  theMountaintop,
  thePalindrome,
  theRecluse,
  witherhoard,
] as unknown[];

function isCoreGodRollPerkSlot(slot: GodRollPerkSlot): slot is CoreGodRollPerkSlot {
  return (CORE_GOD_ROLL_PERK_SLOTS as readonly string[]).includes(slot);
}

function toGodRollSlots(perks: GodRollEntry["rolls"][number]["perks"]): GodRollSlots {
  const slots: GodRollSlots = {};

  for (const slot of CORE_GOD_ROLL_PERK_SLOTS) {
    const options = perks[slot];
    if (options) {
      slots[slot] = [...options];
    }
  }

  return slots;
}

function toGodRollFlexSlots(roll: GodRollEntry["rolls"][number]): GodRollFlexSlot[] {
  return roll.flexSlots
    .filter(isCoreGodRollPerkSlot)
    .map((slot) => ({
      slot,
      perks: [...(roll.perks[slot] ?? [])],
    }))
    .filter((entry) => entry.perks.length > 0);
}

export function createGodRollDefinitions(entries: GodRollEntry[]): GodRollDefinition[] {
  return entries.flatMap((entry) =>
    entry.rolls.map((roll) => ({
      weaponHash: entry.weaponHash,
      mode: roll.mode as GameMode,
      label: roll.label,
      slots: toGodRollSlots(roll.perks),
      flexSlots: toGodRollFlexSlots(roll),
    })),
  );
}

export const godRollEntries: GodRollEntry[] = rawGodRollEntries.map((entry) =>
  godRollEntrySchema.parse(entry),
);

export const godRollDefinitions: GodRollDefinition[] = createGodRollDefinitions(godRollEntries);
