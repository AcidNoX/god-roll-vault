import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ZodError } from "zod";

import { getWeaponName } from "../manifest/lookup.js";
import mvpPlugs from "../manifest/mvp-plugs.json";
import { GOD_ROLL_PERK_SLOTS, type GodRollEntry, godRollEntrySchema } from "./schema.js";

export type GodRollValidationIssue = {
  file?: string;
  path: string;
  message: string;
};

export type GodRollValidationResult = {
  success: boolean;
  fileCount: number;
  issues: GodRollValidationIssue[];
};

const knownPerkNames = new Set(
  Object.values(mvpPlugs as Record<string, { name: string }>).map((entry) => entry.name),
);

/** Directory containing curated god-roll JSON files (`src/god-rolls`). */
export function resolveGodRollsDir(fromModuleUrl = import.meta.url): string {
  const moduleDir = dirname(fileURLToPath(fromModuleUrl));
  return resolve(moduleDir, "../../src/god-rolls");
}

export function formatZodError(error: ZodError, file?: string): GodRollValidationIssue[] {
  return error.issues.map((issue) => ({
    file,
    path: issue.path.length > 0 ? issue.path.join(".") : "(root)",
    message: issue.message,
  }));
}

function collectPerkNames(
  entry: GodRollEntry,
): Array<{ rollIndex: number; slot: string; name: string }> {
  const names: Array<{ rollIndex: number; slot: string; name: string }> = [];
  entry.rolls.forEach((roll, rollIndex) => {
    for (const slot of GOD_ROLL_PERK_SLOTS) {
      const options = roll.perks[slot];
      if (!options) {
        continue;
      }
      for (const name of options) {
        names.push({ rollIndex, slot, name });
      }
    }
  });
  return names;
}

export function validateGodRollManifest(
  entry: GodRollEntry,
  file?: string,
): GodRollValidationIssue[] {
  const issues: GodRollValidationIssue[] = [];
  const expectedWeaponName = getWeaponName(entry.weaponHash);

  if (expectedWeaponName.startsWith("Unknown Weapon")) {
    issues.push({
      file,
      path: "weaponHash",
      message: `weapon hash ${entry.weaponHash} is not in mvp-weapons.json`,
    });
  } else if (entry.weaponName !== expectedWeaponName) {
    issues.push({
      file,
      path: "weaponName",
      message: `expected "${expectedWeaponName}" for hash ${entry.weaponHash}, got "${entry.weaponName}"`,
    });
  }

  for (const { rollIndex, slot, name } of collectPerkNames(entry)) {
    if (!knownPerkNames.has(name)) {
      issues.push({
        file,
        path: `rolls.${rollIndex}.perks.${slot}`,
        message: `unknown perk name "${name}" (not found in mvp-plugs.json)`,
      });
    }
  }

  return issues;
}

export function validateGodRollEntry(
  data: unknown,
  options: { file?: string; checkManifest?: boolean } = {},
): GodRollValidationIssue[] {
  const parsed = godRollEntrySchema.safeParse(data);
  if (!parsed.success) {
    return formatZodError(parsed.error, options.file);
  }

  if (options.checkManifest === false) {
    return [];
  }

  return validateGodRollManifest(parsed.data, options.file);
}

export function validateGodRollFile(
  filePath: string,
  options: { checkManifest?: boolean } = {},
): GodRollValidationIssue[] {
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return [{ file: filePath, path: "(file)", message: `invalid JSON: ${message}` }];
  }

  return validateGodRollEntry(raw, { file: filePath, checkManifest: options.checkManifest });
}

export function validateGodRollDirectory(
  directory = resolveGodRollsDir(),
  options: { checkManifest?: boolean } = {},
): GodRollValidationResult {
  const jsonFiles = readdirSync(directory)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => join(directory, name));

  const issues = jsonFiles.flatMap((filePath) =>
    validateGodRollFile(filePath, { checkManifest: options.checkManifest }),
  );

  return {
    success: issues.length === 0,
    fileCount: jsonFiles.length,
    issues,
  };
}
