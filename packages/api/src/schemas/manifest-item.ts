import { z } from "zod";

export const destinyInventoryItemDefinitionSchema = z.object({
  displayProperties: z.object({
    name: z.string(),
    icon: z.string().optional(),
  }),
  inventory: z
    .object({
      tierTypeName: z.string().optional(),
    })
    .optional(),
  itemType: z.number().optional(),
  itemTypeDisplayName: z.string().optional(),
});

export type DestinyInventoryItemDefinition = z.output<typeof destinyInventoryItemDefinitionSchema>;
