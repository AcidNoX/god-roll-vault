import { z } from "zod";

import { int64Schema } from "./common.js";

export const groupUserInfoCardSchema = z.object({
  membershipType: z.number(),
  membershipId: int64Schema,
  displayName: z.string().optional(),
  bungieGlobalDisplayName: z.string().optional(),
  bungieGlobalDisplayNameCode: z.number().optional(),
});

export const userMembershipDataSchema = z.object({
  destinyMemberships: z.array(groupUserInfoCardSchema),
  primaryMembershipId: int64Schema.nullable().optional(),
  bungieNetUser: z
    .object({
      membershipId: int64Schema,
      displayName: z.string().optional(),
    })
    .optional(),
});

export type GroupUserInfoCard = z.output<typeof groupUserInfoCardSchema>;
export type UserMembershipData = z.output<typeof userMembershipDataSchema>;
