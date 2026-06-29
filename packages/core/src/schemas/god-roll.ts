import { z } from "zod";

export const gameModeSchema = z.enum(["pvp", "pve"]);

export const matchStatusSchema = z.enum(["perfect", "partial", "missing", "unknown"]);

export const weaponPerkSchema = z.object({
  plugHash: z.number(),
  name: z.string(),
});

export const godRollDefinitionSchema = z.object({
  weaponHash: z.number(),
  mode: gameModeSchema,
  perks: z.array(weaponPerkSchema),
});

export const godRollDefinitionsSchema = z.array(godRollDefinitionSchema);
