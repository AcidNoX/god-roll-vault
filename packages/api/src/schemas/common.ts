import { z } from "zod";

/** Bungie int64 values may arrive as JSON numbers or strings. */
export const int64Schema = z.union([z.string(), z.number()]).transform(String);
