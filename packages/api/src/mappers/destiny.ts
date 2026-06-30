import type { DestinyCharacter, DestinyMembership } from "@god-roll-vault/core";

import type { UserMembershipData } from "../schemas/memberships.js";
import type { DestinyProfileResponse } from "../schemas/profile.js";

/** Platforms Bungie still serves Destiny profile data for. */
const DEPRECATED_DESTINY_MEMBERSHIP_TYPES = new Set([4, 5]);

function formatDisplayName(
  displayName: string | undefined,
  bungieGlobalDisplayName: string | undefined,
  bungieGlobalDisplayNameCode: number | undefined,
): string {
  if (bungieGlobalDisplayName) {
    if (bungieGlobalDisplayNameCode !== undefined) {
      return `${bungieGlobalDisplayName}#${String(bungieGlobalDisplayNameCode).padStart(4, "0")}`;
    }
    return bungieGlobalDisplayName;
  }

  return displayName ?? "";
}

export function mapMemberships(data: UserMembershipData): DestinyMembership[] {
  return data.destinyMemberships.map((membership) => ({
    membershipType: membership.membershipType,
    membershipId: membership.membershipId,
    displayName: formatDisplayName(
      membership.displayName,
      membership.bungieGlobalDisplayName,
      membership.bungieGlobalDisplayNameCode,
    ),
  }));
}

/**
 * Memberships that can still return Destiny profile data.
 * Cross-save accounts only play on `primaryMembershipId`; Stadia/Blizzard are defunct.
 */
export function resolvePlayableMemberships(data: UserMembershipData): DestinyMembership[] {
  const memberships = mapMemberships(data);

  if (data.primaryMembershipId) {
    const primary = memberships.find(
      (membership) => membership.membershipId === data.primaryMembershipId,
    );
    if (primary && !DEPRECATED_DESTINY_MEMBERSHIP_TYPES.has(primary.membershipType)) {
      return [primary];
    }
  }

  return memberships.filter(
    (membership) => !DEPRECATED_DESTINY_MEMBERSHIP_TYPES.has(membership.membershipType),
  );
}

export function mapCharacters(profile: DestinyProfileResponse): DestinyCharacter[] {
  if (!profile.characters) {
    return [];
  }

  return Object.values(profile.characters).map((character) => ({
    characterId: character.characterId,
    classType: character.classType,
    light: character.light,
    dateLastPlayed: character.dateLastPlayed,
  }));
}
