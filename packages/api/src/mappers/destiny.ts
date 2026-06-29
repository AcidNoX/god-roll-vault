import type { DestinyCharacter, DestinyMembership } from "@god-roll-vault/core";

import type { UserMembershipData } from "../schemas/memberships.js";
import type { DestinyProfileResponse } from "../schemas/profile.js";

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
