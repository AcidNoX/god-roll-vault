import { z } from "zod";

export const destinySeasonDefinitionSchema = z.object({
  displayProperties: z.object({
    icon: z.string().optional(),
  }),
});

export type DestinySeasonDefinition = z.output<typeof destinySeasonDefinitionSchema>;
