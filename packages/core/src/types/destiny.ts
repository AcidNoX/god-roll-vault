export type DestinyMembership = {
  membershipType: number;
  membershipId: string;
  displayName: string;
};

export type DestinyCharacter = {
  characterId: string;
  classType: number;
  light: number;
  dateLastPlayed: string;
};
