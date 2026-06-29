import { z } from "zod";

export const bungieEnvelopeSchema = <T extends z.ZodTypeAny>(responseSchema: T) =>
  z.object({
    Response: responseSchema,
    ErrorCode: z.number(),
    ThrottleSeconds: z.number(),
    ErrorStatus: z.string(),
    Message: z.string(),
    MessageData: z.record(z.unknown()),
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
