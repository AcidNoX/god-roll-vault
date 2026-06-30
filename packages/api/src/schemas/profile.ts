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
  items: z.array(destinyItemComponentSchema).default([]),
  privacy: z.number().optional(),
});

export const destinyCharacterComponentSchema = z.object({
  characterId: int64Schema,
  classType: z.number(),
  light: z.number(),
  dateLastPlayed: z.string(),
  emblemHash: z.number().optional(),
});

/**
 * Bungie dictionary components arrive as `{ data: { id: entry }, privacy }`.
 * Tests and older fixtures may use the unwrapped record directly.
 */
function dictionaryComponentRecord<T extends z.ZodTypeAny>(entrySchema: T) {
  return z.preprocess((value) => {
    if (!value || typeof value !== "object") {
      return undefined;
    }

    if ("data" in value) {
      const wrapped = value as { data?: Record<string, unknown> };
      return wrapped.data;
    }

    return value;
  }, z.record(entrySchema).optional());
}

/** Bungie single components (vault, profile, etc.) use the same `{ data, privacy }` envelope. */
function singleComponent<T extends z.ZodTypeAny>(componentSchema: T) {
  return z.preprocess((value) => {
    if (!value || typeof value !== "object") {
      return undefined;
    }

    if ("data" in value) {
      return (value as { data?: unknown }).data;
    }

    return value;
  }, componentSchema.optional());
}

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

export const destinyReusablePlugSchema = z.object({
  plugItemHash: z.number(),
});

export const destinyItemReusablePlugsComponentSchema = z.object({
  plugs: z.record(z.array(destinyReusablePlugSchema)).optional(),
});

export const destinyProfileResponseSchema = z.object({
  characters: dictionaryComponentRecord(destinyCharacterComponentSchema),
  characterInventories: dictionaryComponentRecord(destinyInventoryComponentSchema),
  characterEquipment: dictionaryComponentRecord(destinyInventoryComponentSchema),
  profileInventory: singleComponent(destinyInventoryComponentSchema),
  itemComponents: z
    .object({
      instances: singleComponent(z.record(destinyItemInstanceComponentSchema)),
      sockets: singleComponent(
        z.record(
          z.object({
            sockets: z.array(destinyItemSocketStateSchema).optional(),
          }),
        ),
      ),
      reusablePlugs: singleComponent(z.record(destinyItemReusablePlugsComponentSchema)),
    })
    .partial()
    .optional()
    .transform((itemComponents) => {
      if (!itemComponents) {
        return undefined;
      }

      const normalized: {
        instances?: { data: Record<string, z.infer<typeof destinyItemInstanceComponentSchema>> };
        sockets?: {
          data: Record<string, { sockets?: z.infer<typeof destinyItemSocketStateSchema>[] }>;
        };
        reusablePlugs?: {
          data: Record<string, z.infer<typeof destinyItemReusablePlugsComponentSchema>>;
        };
      } = {};

      if (itemComponents.instances) {
        normalized.instances = { data: itemComponents.instances };
      }
      if (itemComponents.sockets) {
        normalized.sockets = { data: itemComponents.sockets };
      }
      if (itemComponents.reusablePlugs) {
        normalized.reusablePlugs = { data: itemComponents.reusablePlugs };
      }

      return Object.keys(normalized).length > 0 ? normalized : undefined;
    }),
});

export type DestinyItemComponent = z.output<typeof destinyItemComponentSchema>;
export type DestinyInventoryComponent = z.output<typeof destinyInventoryComponentSchema>;
export type DestinyCharacterComponent = z.output<typeof destinyCharacterComponentSchema>;
export type DestinyProfileResponse = z.output<typeof destinyProfileResponseSchema>;
