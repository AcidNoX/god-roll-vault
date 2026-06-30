import { z } from "zod";

/** Bungie envelope fields shared by success and error responses. */
export const bungieEnvelopeMetaSchema = z.object({
  ErrorCode: z.number(),
  ThrottleSeconds: z.number(),
  ErrorStatus: z.string(),
  Message: z.string(),
  MessageData: z.record(z.unknown()).optional().default({}),
  Response: z.unknown().optional(),
});

export const bungieEnvelopeSchema = <T extends z.ZodTypeAny>(responseSchema: T) =>
  bungieEnvelopeMetaSchema.extend({
    Response: responseSchema,
  });

export type BungieEnvelope<T> = {
  Response: T;
  ErrorCode: number;
  ThrottleSeconds: number;
  ErrorStatus: string;
  Message: string;
  MessageData: Record<string, unknown>;
};

export const BUNGIE_SUCCESS_ERROR_CODE = 1;
