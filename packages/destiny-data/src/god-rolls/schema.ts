import { gameModeSchema } from "@god-roll-vault/core";
import { z } from "zod";

/** Socket column keys used in curated god-roll JSON (barrel through origin trait). */
export const GOD_ROLL_PERK_SLOTS = [
  "barrel",
  "magazine",
  "perk1",
  "perk2",
  "perk3",
  "originTrait",
] as const;

export type GodRollPerkSlot = (typeof GOD_ROLL_PERK_SLOTS)[number];

export const godRollPerkSlotSchema = z.enum(GOD_ROLL_PERK_SLOTS);

const perkOptionsSchema = z.array(z.string().min(1)).min(1);

export const godRollPerksSchema = z
  .object({
    barrel: perkOptionsSchema.optional(),
    magazine: perkOptionsSchema.optional(),
    perk1: perkOptionsSchema.optional(),
    perk2: perkOptionsSchema.optional(),
    perk3: perkOptionsSchema.optional(),
    originTrait: perkOptionsSchema.optional(),
  })
  .refine((perks) => GOD_ROLL_PERK_SLOTS.some((slot) => perks[slot] !== undefined), {
    message: "At least one perk slot must be defined",
  });

export const godRollRollSchema = z
  .object({
    mode: gameModeSchema,
    label: z.string().min(1),
    perks: godRollPerksSchema,
    flexSlots: z.array(godRollPerkSlotSchema).default([]),
  })
  .superRefine((roll, ctx) => {
    const definedSlots = GOD_ROLL_PERK_SLOTS.filter((slot) => roll.perks[slot] !== undefined);
    for (const slot of roll.flexSlots) {
      if (!definedSlots.includes(slot)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `flexSlots entry "${slot}" is not a defined perks slot (${definedSlots.join(", ") || "none"})`,
          path: ["flexSlots"],
        });
      }
    }
  });

export const godRollEntrySchema = z.object({
  weaponHash: z.number().int().positive(),
  weaponName: z.string().min(1),
  rolls: z.array(godRollRollSchema).min(1),
});

export type GodRollPerks = z.infer<typeof godRollPerksSchema>;
export type GodRollRoll = z.infer<typeof godRollRollSchema>;
export type GodRollEntry = z.infer<typeof godRollEntrySchema>;
