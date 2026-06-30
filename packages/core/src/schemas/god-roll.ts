import { z } from "zod";

export const gameModeSchema = z.enum(["pvp", "pve"]);

export const matchStatusSchema = z.enum(["perfect", "partial", "missing", "unknown"]);

export const weaponPerkSchema = z.object({
  plugHash: z.number(),
  name: z.string(),
  iconUrl: z.string().optional(),
});

export const godRollPerkSlotSchema = z.enum(["barrel", "magazine", "perk1", "perk2"]);

export const godRollSlotsSchema = z.object({
  barrel: z.array(z.string()).optional(),
  magazine: z.array(z.string()).optional(),
  perk1: z.array(z.string()).optional(),
  perk2: z.array(z.string()).optional(),
});

export const godRollFlexSlotSchema = z.object({
  slot: godRollPerkSlotSchema,
  perks: z.array(z.string()),
});

export const godRollDefinitionSchema = z.object({
  weaponHash: z.number(),
  alternateWeaponHashes: z.array(z.number()).optional(),
  mode: gameModeSchema,
  label: z.string().optional(),
  slots: godRollSlotsSchema.optional(),
  flexSlots: z.array(godRollFlexSlotSchema).optional(),
  perks: z.array(weaponPerkSchema).optional(),
});

export const godRollDefinitionsSchema = z.array(godRollDefinitionSchema);
