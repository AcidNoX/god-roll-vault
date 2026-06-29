import { z } from "zod";

import {
  destinyCharacterComponentSchema,
  destinyInventoryComponentSchema,
  destinyItemComponentSchema,
} from "./profile.js";

export const destinyCharacterResponseSchema = z.object({
  character: destinyCharacterComponentSchema,
  characterInventory: destinyInventoryComponentSchema.optional(),
  characterEquipment: destinyInventoryComponentSchema.optional(),
  itemComponents: z
    .object({
      instances: z
        .object({
          data: z.record(
            z.object({
              primaryStat: z
                .object({
                  value: z.number(),
                })
                .optional(),
              damageTypeHash: z.number().optional(),
            }),
          ),
        })
        .optional(),
    })
    .optional(),
});

export const destinyItemResponseSchema = z.object({
  item: destinyItemComponentSchema,
  itemComponents: z
    .object({
      instances: z
        .object({
          data: z.record(
            z.object({
              primaryStat: z
                .object({
                  value: z.number(),
                })
                .optional(),
              damageTypeHash: z.number().optional(),
            }),
          ),
        })
        .optional(),
      sockets: z
        .object({
          data: z.record(
            z.object({
              sockets: z
                .array(
                  z.object({
                    plugHash: z.number().nullable().optional(),
                  }),
                )
                .optional(),
            }),
          ),
        })
        .optional(),
    })
    .optional(),
});

export type DestinyCharacterResponse = z.infer<typeof destinyCharacterResponseSchema>;
export type DestinyItemResponse = z.infer<typeof destinyItemResponseSchema>;
