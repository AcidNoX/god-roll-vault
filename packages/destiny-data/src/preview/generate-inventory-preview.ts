import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  type GodRollPerkSlot,
  groupInventoryByWeapon,
  type InstanceDisposition,
  type InventoryWeapon,
  type MatchStatus,
  type WeaponPerk,
  type WeaponPerks,
} from "@god-roll-vault/core";

import { ENERGY_WEAPON_BUCKET, KINETIC_WEAPON_BUCKET, POWER_WEAPON_BUCKET } from "../buckets.js";
import { godRollDefinitions, godRollEntries } from "../god-rolls/definitions.js";
import {
  PREVIEW_CHARACTER,
  PREVIEW_MODE,
  PREVIEW_SELECTED_INSTANCE_ID,
  previewInventoryWeapons,
} from "./inventory-fixture.js";

const SLOT_LABELS: Record<GodRollPerkSlot, string> = {
  barrel: "Barrel",
  magazine: "Magazine",
  perk1: "Perk 1",
  perk2: "Perk 2",
};

const BUCKET_SECTIONS = [
  { bucketHash: KINETIC_WEAPON_BUCKET, key: "kinetic", label: "Kinetic" },
  { bucketHash: ENERGY_WEAPON_BUCKET, key: "energy", label: "Energy" },
  { bucketHash: POWER_WEAPON_BUCKET, key: "power", label: "Power" },
] as const;

const DISPOSITION_LABELS: Record<InstanceDisposition, string> = {
  keep: "Keep",
  dismantle: "Dismantle",
  consider: "Consider",
  only: "Only copy",
};

export type PreviewPerkCell = {
  name: string;
  iconUrl?: string;
};

export type PreviewPerkRow = {
  slot: GodRollPerkSlot | "originTrait";
  label: string;
  yours?: PreviewPerkCell;
  target?: PreviewPerkCell | null;
  matched: boolean;
};

export type PreviewWeaponTile = {
  itemInstanceId: string;
  itemHash: number;
  name: string;
  tier: string;
  power: number;
  element: InventoryWeapon["element"];
  iconUrl?: string;
  matchStatus: MatchStatus;
  badge: "perfect" | "partial" | "missing" | null;
};

export type PreviewWeaponCopy = PreviewWeaponTile & {
  rank: number;
  disposition: InstanceDisposition;
  dispositionLabel: string;
};

export type PreviewWeaponGroup = {
  itemHash: number;
  name: string;
  copyCount: number;
  dispositionSummary: string;
  keeper: PreviewWeaponCopy;
  copies: PreviewWeaponCopy[];
};

export type PreviewInventoryData = {
  generatedAt: string;
  mode: typeof PREVIEW_MODE;
  character: typeof PREVIEW_CHARACTER;
  summary: {
    weaponGroups: number;
    duplicateGroups: number;
    keepers: number;
    dismantleCandidates: number;
  };
  sections: Array<{
    key: (typeof BUCKET_SECTIONS)[number]["key"];
    label: string;
    groups: PreviewWeaponGroup[];
  }>;
  selectedInstanceId: string;
  detail: {
    weapon: PreviewWeaponTile;
    keeperInstanceId: string;
    duplicateCopies: PreviewWeaponCopy[];
    rollLabel?: string;
    verdict: {
      matched: number;
      total: number;
      caption: string;
    };
    perkRows: PreviewPerkRow[];
    rollSource: string;
  };
};

function toWeaponPerks(perks: InventoryWeapon["perks"]): WeaponPerks {
  const [barrel, magazine, perk1, perk2, originTrait] = perks;
  return { barrel, magazine, perk1, perk2, originTrait };
}

function toPerkCell(perk: WeaponPerk | undefined): PreviewPerkCell | undefined {
  if (!perk) {
    return undefined;
  }
  return {
    name: perk.name,
    ...(perk.iconUrl ? { iconUrl: perk.iconUrl } : {}),
  };
}

function badgeForStatus(status: MatchStatus): PreviewWeaponTile["badge"] {
  if (status === "perfect") return "perfect";
  if (status === "partial") return "partial";
  if (status === "missing") return "missing";
  return null;
}

function rollLabelForWeapon(itemHash: number, mode: typeof PREVIEW_MODE): string | undefined {
  const entry = godRollEntries.find((candidate) => candidate.weaponHash === itemHash);
  return entry?.rolls.find((roll) => roll.mode === mode)?.label;
}

function tileFromEvaluation(
  weapon: InventoryWeapon,
  matchStatus: MatchStatus,
  rank: number,
  disposition: InstanceDisposition,
): PreviewWeaponCopy {
  return {
    itemInstanceId: weapon.itemInstanceId,
    itemHash: weapon.itemHash,
    name: weapon.name,
    tier: weapon.tier,
    power: weapon.power,
    element: weapon.element,
    ...(weapon.iconUrl ? { iconUrl: weapon.iconUrl } : {}),
    matchStatus,
    badge: badgeForStatus(matchStatus),
    rank,
    disposition,
    dispositionLabel: DISPOSITION_LABELS[disposition],
  };
}

function buildDispositionSummary(copies: PreviewWeaponCopy[]): string {
  if (copies.length === 1) {
    return "1 copy";
  }

  const keepCount = copies.filter((copy) => copy.disposition === "keep").length;
  const dismantleCount = copies.filter((copy) => copy.disposition === "dismantle").length;
  const considerCount = copies.filter((copy) => copy.disposition === "consider").length;

  const parts = [`${copies.length} copies`];
  if (keepCount > 0) {
    parts.push(`keep ${keepCount}`);
  }
  if (dismantleCount > 0) {
    parts.push(`dismantle ${dismantleCount}`);
  }
  if (considerCount > 0) {
    parts.push(`consider ${considerCount}`);
  }

  return parts.join(" · ");
}

function groupToPreview(
  group: ReturnType<typeof groupInventoryByWeapon>[number],
): PreviewWeaponGroup {
  const copies = group.instances.map((instance) =>
    tileFromEvaluation(
      instance.evaluation.weapon,
      instance.evaluation.result.status,
      instance.rank,
      instance.disposition,
    ),
  );

  const keeper = copies[0];
  if (!keeper) {
    throw new Error(`Weapon group ${group.itemHash} has no ranked copies`);
  }

  return {
    itemHash: group.itemHash,
    name: group.weaponName,
    copyCount: group.copyCount,
    dispositionSummary: buildDispositionSummary(copies),
    keeper,
    copies,
  };
}

function buildVerdictCaption(rows: PreviewPerkRow[]): {
  matched: number;
  total: number;
  caption: string;
} {
  const evaluated = rows.filter((row) => row.slot !== "originTrait");
  const matched = evaluated.filter((row) => row.matched).length;
  const total = evaluated.length;
  const firstMiss = evaluated.find((row) => !row.matched);

  const caption = firstMiss
    ? `${firstMiss.label} is ${firstMiss.yours?.name ?? "empty"} — PVP target wants ${firstMiss.target?.name ?? "another perk"}`
    : "All evaluated perks match the PVP target";

  return { matched, total, caption };
}

function buildSummary(groups: PreviewWeaponGroup[]): PreviewInventoryData["summary"] {
  const duplicateGroups = groups.filter((group) => group.copyCount > 1).length;
  const keepers = groups.filter((group) => group.keeper.disposition === "keep").length;
  const dismantleCandidates = groups.reduce(
    (count, group) =>
      count + group.copies.filter((copy) => copy.disposition === "dismantle").length,
    0,
  );

  return {
    weaponGroups: groups.length,
    duplicateGroups,
    keepers,
    dismantleCandidates,
  };
}

export function buildInventoryPreviewData(): PreviewInventoryData {
  const groupedWeapons = groupInventoryByWeapon(
    previewInventoryWeapons,
    godRollDefinitions,
    PREVIEW_MODE,
  );
  const weaponGroups = groupedWeapons.map(groupToPreview);
  const groupByHash = new Map(weaponGroups.map((group) => [group.itemHash, group]));
  const coreGroupByHash = new Map(groupedWeapons.map((group) => [group.itemHash, group]));

  const sections = BUCKET_SECTIONS.map((section) => ({
    key: section.key,
    label: section.label,
    groups: weaponGroups.filter((group) => {
      const keeperWeapon = previewInventoryWeapons.find(
        (weapon) => weapon.itemInstanceId === group.keeper.itemInstanceId,
      );
      return keeperWeapon?.bucketHash === section.bucketHash;
    }),
  }));

  const selectedWeapon = previewInventoryWeapons.find(
    (weapon) => weapon.itemInstanceId === PREVIEW_SELECTED_INSTANCE_ID,
  );
  if (!selectedWeapon) {
    throw new Error(`Preview fixture missing selected weapon ${PREVIEW_SELECTED_INSTANCE_ID}`);
  }

  const selectedGroup = groupByHash.get(selectedWeapon.itemHash);
  if (!selectedGroup) {
    throw new Error(`Preview fixture missing weapon group for ${selectedWeapon.itemHash}`);
  }

  const selectedCopy = selectedGroup.copies.find(
    (copy) => copy.itemInstanceId === PREVIEW_SELECTED_INSTANCE_ID,
  );
  if (!selectedCopy) {
    throw new Error(`Selected copy missing from group ${selectedWeapon.itemHash}`);
  }

  const rankedInstance = coreGroupByHash
    .get(selectedWeapon.itemHash)
    ?.instances.find(
      (instance) => instance.evaluation.weapon.itemInstanceId === PREVIEW_SELECTED_INSTANCE_ID,
    );

  const slottedPerks = toWeaponPerks(selectedWeapon.perks);
  const perkRows: PreviewPerkRow[] =
    rankedInstance?.evaluation.result.details.map((detail) => ({
      slot: detail.slot,
      label: SLOT_LABELS[detail.slot],
      yours: toPerkCell(slottedPerks[detail.slot]),
      target: { name: detail.target },
      matched: detail.matched,
    })) ?? [];

  if (slottedPerks.originTrait) {
    perkRows.push({
      slot: "originTrait",
      label: "Origin trait",
      yours: toPerkCell(slottedPerks.originTrait),
      target: null,
      matched: false,
    });
  }

  const verdict = buildVerdictCaption(perkRows);
  const rollLabel = rollLabelForWeapon(selectedWeapon.itemHash, PREVIEW_MODE);

  return {
    generatedAt: new Date().toISOString(),
    mode: PREVIEW_MODE,
    character: PREVIEW_CHARACTER,
    summary: buildSummary(weaponGroups),
    sections,
    selectedInstanceId: PREVIEW_SELECTED_INSTANCE_ID,
    detail: {
      weapon: {
        itemInstanceId: selectedCopy.itemInstanceId,
        itemHash: selectedCopy.itemHash,
        name: selectedCopy.name,
        tier: selectedCopy.tier,
        power: selectedCopy.power,
        element: selectedCopy.element,
        ...(selectedCopy.iconUrl ? { iconUrl: selectedCopy.iconUrl } : {}),
        matchStatus: selectedCopy.matchStatus,
        badge: selectedCopy.badge,
      },
      keeperInstanceId: selectedGroup.keeper.itemInstanceId,
      duplicateCopies: selectedGroup.copies,
      ...(rollLabel ? { rollLabel } : {}),
      verdict,
      perkRows,
      rollSource: `PVP · ${rollLabel ?? "curated"} roll · god-roll-vault`,
    },
  };
}

export function writeInventoryPreviewData(outputPath: string): PreviewInventoryData {
  const data = buildInventoryPreviewData();
  writeFileSync(outputPath, `window.INVENTORY_PREVIEW_DATA = ${JSON.stringify(data, null, 2)};\n`);
  return data;
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
  const packageRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));
  const repoRoot = resolve(packageRoot, "../..");
  const outputPath = resolve(repoRoot, "design/previews/inventory-data.js");
  const data = writeInventoryPreviewData(outputPath);
  const groupCount = data.sections.reduce((count, section) => count + section.groups.length, 0);
  console.log(`Wrote ${outputPath} (${groupCount} weapon groups)`);
}
