import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  evaluateInventory,
  type GodRollPerkSlot,
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

export type PreviewInventoryData = {
  generatedAt: string;
  mode: typeof PREVIEW_MODE;
  character: typeof PREVIEW_CHARACTER;
  sections: Array<{
    key: (typeof BUCKET_SECTIONS)[number]["key"];
    label: string;
    weapons: PreviewWeaponTile[];
  }>;
  selectedInstanceId: string;
  detail: {
    weapon: PreviewWeaponTile;
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

function tileFromWeapon(weapon: InventoryWeapon, matchStatus: MatchStatus): PreviewWeaponTile {
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

export function buildInventoryPreviewData(): PreviewInventoryData {
  const evaluations = evaluateInventory(previewInventoryWeapons, godRollDefinitions, PREVIEW_MODE);
  const evaluationById = new Map(
    evaluations.map((evaluation) => [evaluation.weapon.itemInstanceId, evaluation]),
  );

  const sections = BUCKET_SECTIONS.map((section) => ({
    key: section.key,
    label: section.label,
    weapons: previewInventoryWeapons
      .filter((weapon) => weapon.bucketHash === section.bucketHash)
      .map((weapon) => {
        const evaluation = evaluationById.get(weapon.itemInstanceId);
        return tileFromWeapon(weapon, evaluation?.result.status ?? "unknown");
      }),
  }));

  const selectedEvaluation = evaluations.find(
    (evaluation) => evaluation.weapon.itemInstanceId === PREVIEW_SELECTED_INSTANCE_ID,
  );
  if (!selectedEvaluation) {
    throw new Error(`Preview fixture missing selected weapon ${PREVIEW_SELECTED_INSTANCE_ID}`);
  }

  const slottedPerks = toWeaponPerks(selectedEvaluation.weapon.perks);
  const perkRows: PreviewPerkRow[] = selectedEvaluation.result.details.map((detail) => ({
    slot: detail.slot,
    label: SLOT_LABELS[detail.slot],
    yours: toPerkCell(slottedPerks[detail.slot]),
    target: { name: detail.target },
    matched: detail.matched,
  }));

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
  const rollLabel = rollLabelForWeapon(selectedEvaluation.weapon.itemHash, PREVIEW_MODE);

  return {
    generatedAt: new Date().toISOString(),
    mode: PREVIEW_MODE,
    character: PREVIEW_CHARACTER,
    sections,
    selectedInstanceId: PREVIEW_SELECTED_INSTANCE_ID,
    detail: {
      weapon: tileFromWeapon(selectedEvaluation.weapon, selectedEvaluation.result.status),
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
  console.log(`Wrote ${outputPath} (${data.sections.flatMap((s) => s.weapons).length} weapons)`);
}
