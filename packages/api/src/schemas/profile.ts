import { z } from "zod";

import { int64Schema } from "./common.js";

export const destinyItemComponentSchema = z.object({
  itemHash: z.number(),
  itemInstanceId: int64Schema.optional(),
  bucketHash: z.number(),
  quantity: z.number().optional(),
  state: z.number().optional(),
});

export const destinyInventoryComponentSchema = z.object({
  items: z.array(destinyItemComponentSchema),
  privacy: z.number().optional(),
});

export const destinyCharacterComponentSchema = z.object({
  characterId: int64Schema,
  classType: z.number(),
  light: z.number(),
  dateLastPlayed: z.string(),
  emblemHash: z.number().optional(),
});

export const destinyItemSocketStateSchema = z.object({
  plugHash: z.number().nullable().optional(),
  isEnabled: z.boolean().optional(),
  isVisible: z.boolean().optional(),
});

export const destinyItemInstanceComponentSchema = z.object({
  primaryStat: z
    .object({
      value: z.number(),
    })
    .optional(),
  damageTypeHash: z.number().optional(),
  isEquipped: z.boolean().optional(),
});

export const destinyProfileResponseSchema = z.object({
  characters: z.record(destinyCharacterComponentSchema).optional(),
  characterInventories: z.record(destinyInventoryComponentSchema).optional(),
  profileInventory: destinyInventoryComponentSchema.optional(),
  itemComponents: z
    .object({
      instances: z
        .object({
          data: z.record(destinyItemInstanceComponentSchema),
        })
        .optional(),
      sockets: z
        .object({
          data: z.record(
            z.object({
              sockets: z.array(destinyItemSocketStateSchema).optional(),
            }),
          ),
        })
        .optional(),
    })
    .optional(),
});

export type DestinyItemComponent = z.infer<typeof destinyItemComponentSchema>;
export type DestinyInventoryComponent = z.infer<typeof destinyInventoryComponentSchema>;
export type DestinyCharacterComponent = z.infer<typeof destinyCharacterComponentSchema>;
export type DestinyProfileResponse = z.infer<typeof destinyProfileResponseSchema>;
