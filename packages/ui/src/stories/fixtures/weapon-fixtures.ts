import type {
  InventoryWeapon,
  MatchStatus,
  RollMatchPerkDetail,
  RollMatchResult,
  WeaponDuplicateGroup,
  WeaponPerks,
} from "@god-roll-vault/core";

const FATEBRINGER_ICON = "https://www.bungie.net/common/destiny2_content/icons/fatebringer.jpg";
const SEASON_ICON = "https://www.bungie.net/common/destiny2_content/icons/season.jpg";
const WATERMARK_ICON = "https://www.bungie.net/common/destiny2_content/icons/watermark.jpg";
const KILL_CLIP_ICON = "https://www.bungie.net/common/destiny2_content/icons/kill-clip.png";

export const legendaryWeapon: InventoryWeapon = {
  itemHash: 1363886209,
  itemInstanceId: "6913529092654216196",
  name: "Fatebringer (Timelost)",
  tier: "Legendary",
  tierType: "legendary",
  power: 1985,
  element: "arc",
  perks: [],
  location: "character",
  bucketHash: 149531261,
  isEquipped: false,
  iconUrl: FATEBRINGER_ICON,
  seasonIconUrl: SEASON_ICON,
  watermarkIconUrl: WATERMARK_ICON,
};

export const exoticWeapon: InventoryWeapon = {
  ...legendaryWeapon,
  itemInstanceId: "exotic-instance-1",
  name: "Whisper of the Worm",
  tier: "Exotic",
  tierType: "exotic",
  element: "void",
  power: 2000,
};

export const shinyWeapon: InventoryWeapon = {
  ...legendaryWeapon,
  itemInstanceId: "shiny-instance-1",
  isShiny: true,
};

export const weaponWithSeasonArt: InventoryWeapon = {
  ...legendaryWeapon,
  itemInstanceId: "season-art-instance-1",
  seasonIconUrl: SEASON_ICON,
  watermarkIconUrl: WATERMARK_ICON,
};

export function makeMatchResult(
  status: MatchStatus,
  weapon: InventoryWeapon = legendaryWeapon,
): RollMatchResult {
  return {
    status,
    mode: "pve",
    weaponHash: weapon.itemHash,
    itemInstanceId: weapon.itemInstanceId,
    score: status === "perfect" ? 100 : status === "partial" ? 67 : 0,
    matchedPerks: [],
    missingPerks: [],
    details: [],
  };
}

export const samplePerks: WeaponPerks = {
  barrel: { plugHash: 1, name: "Arrowhead Brake" },
  magazine: { plugHash: 2, name: "Ricochet Rounds" },
  perk1: { plugHash: 3, name: "Kill Clip", iconUrl: KILL_CLIP_ICON },
  perk2: { plugHash: 4, name: "Rampage" },
  originTrait: { plugHash: 5, name: "Nadir Focus" },
};

const matchedPerkDetails: RollMatchPerkDetail[] = [
  {
    slot: "barrel",
    target: "Arrowhead Brake",
    matched: true,
    matchedPerkName: "Arrowhead Brake",
  },
  {
    slot: "magazine",
    target: "Ricochet Rounds",
    matched: true,
    matchedPerkName: "Ricochet Rounds",
  },
  {
    slot: "perk1",
    target: "Kill Clip",
    matched: true,
    matchedPerkName: "Kill Clip",
  },
  {
    slot: "perk2",
    target: "Rampage",
    matched: true,
    matchedPerkName: "Rampage",
  },
];

const partialPerkDetails: RollMatchPerkDetail[] = matchedPerkDetails.map((detail) =>
  detail.slot === "perk2" ? { slot: "perk2", target: "Rampage", matched: false } : detail,
);

export const matchedPerkListResult: RollMatchResult = {
  status: "perfect",
  mode: "pvp",
  weaponHash: legendaryWeapon.itemHash,
  itemInstanceId: legendaryWeapon.itemInstanceId,
  score: 100,
  matchedPerks: matchedPerkDetails.filter((detail) => detail.matched),
  missingPerks: [],
  details: matchedPerkDetails,
};

export const partialPerkListResult: RollMatchResult = {
  status: "partial",
  mode: "pvp",
  weaponHash: legendaryWeapon.itemHash,
  itemInstanceId: legendaryWeapon.itemInstanceId,
  score: 75,
  matchedPerks: partialPerkDetails.filter((detail) => detail.matched),
  missingPerks: partialPerkDetails.filter((detail) => !detail.matched),
  details: partialPerkDetails,
};

export const partialPerks: WeaponPerks = {
  ...samplePerks,
  perk2: { plugHash: 99, name: "Explosive Payload" },
};

export const singleCopyGroup: WeaponDuplicateGroup = {
  itemHash: legendaryWeapon.itemHash,
  weaponName: legendaryWeapon.name,
  iconUrl: legendaryWeapon.iconUrl,
  mode: "pve",
  copyCount: 1,
  keeper: {
    weapon: legendaryWeapon,
    result: makeMatchResult("perfect", legendaryWeapon),
  },
  instances: [
    {
      rank: 1,
      disposition: "only",
      evaluation: {
        weapon: legendaryWeapon,
        result: makeMatchResult("perfect", legendaryWeapon),
      },
    },
  ],
};

export const duplicateGroup: WeaponDuplicateGroup = {
  itemHash: legendaryWeapon.itemHash,
  weaponName: legendaryWeapon.name,
  iconUrl: legendaryWeapon.iconUrl,
  mode: "pve",
  copyCount: 3,
  keeper: {
    weapon: { ...legendaryWeapon, itemInstanceId: "keeper-instance", power: 1990 },
    result: makeMatchResult("perfect", legendaryWeapon),
  },
  instances: [
    {
      rank: 1,
      disposition: "keep",
      evaluation: {
        weapon: { ...legendaryWeapon, itemInstanceId: "keeper-instance", power: 1990 },
        result: makeMatchResult("perfect", legendaryWeapon),
      },
    },
    {
      rank: 2,
      disposition: "consider",
      evaluation: {
        weapon: { ...legendaryWeapon, itemInstanceId: "consider-instance", power: 1975 },
        result: makeMatchResult("partial", legendaryWeapon),
      },
    },
    {
      rank: 3,
      disposition: "dismantle",
      evaluation: {
        weapon: { ...legendaryWeapon, itemInstanceId: "junk-instance", power: 1800 },
        result: makeMatchResult("missing", legendaryWeapon),
      },
    },
  ],
};
