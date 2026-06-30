/**
 * Validates design/tokens/design-tokens.json structure (LEE-70).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const tokensPath = resolve(root, "design/tokens/design-tokens.json");
const tokens = JSON.parse(readFileSync(tokensPath, "utf8"));

const requiredColorGroups = ["app", "border", "text", "brand", "rarity", "element", "godRoll"];
const requiredGodRollStates = ["perfect", "partial", "missing", "unknown"];
const requiredRarities = ["common", "uncommon", "rare", "legendary", "exotic"];

let errors = 0;

function fail(message) {
  console.error(`ERROR: ${message}`);
  errors += 1;
}

for (const group of requiredColorGroups) {
  if (!tokens.color?.[group]) {
    fail(`missing color.${group}`);
  }
}

for (const state of requiredGodRollStates) {
  if (!tokens.color?.godRoll?.[state]) {
    fail(`missing color.godRoll.${state}`);
  }
}

for (const tier of requiredRarities) {
  if (!tokens.color?.rarity?.[tier]) {
    fail(`missing color.rarity.${tier}`);
  }
}

if (tokens.size?.itemTile !== 50) {
  fail("size.itemTile should be 50 (DIM default tile)");
}

if (!tokens.meta?.figma?.includes("figma.com")) {
  fail("meta.figma must link to Figma file");
}

if (errors > 0) {
  console.error(`\n${errors} validation error(s).`);
  process.exit(1);
}

console.log(
  `OK: ${tokens.meta.name} — ${Object.keys(tokens.color.rarity).length} rarities, item tile ${tokens.size.itemTile}px`,
);
