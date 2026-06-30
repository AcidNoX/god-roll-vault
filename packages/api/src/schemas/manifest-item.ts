import { z } from "zod";

export const destinyInventoryItemDefinitionSchema = z.object({
  displayProperties: z.object({
    name: z.string(),
    icon: z.string().optional(),
    iconWatermark: z.string().optional(),
    iconWatermarkShelved: z.string().optional(),
  }),
  inventory: z
    .object({
      tierTypeName: z.string().optional(),
      tierType: z.number().optional(),
    })
    .optional(),
  itemType: z.number().optional(),
  itemTypeDisplayName: z.string().optional(),
  seasonHash: z.number().optional(),
});

export type DestinyInventoryItemDefinition = z.output<typeof destinyInventoryItemDefinitionSchema>;
