/**
 * Validates design/screens/screens.json and preview HTML files (LEE-71).
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const screensPath = resolve(root, "design/screens/screens.json");
const previewsDir = resolve(root, "design/previews");
const screens = JSON.parse(readFileSync(screensPath, "utf8"));

const requiredScreenIds = ["login", "app-shell", "inventory", "weapon-detail", "settings"];
const requiredPreviewFiles = [
  "index.html",
  "login.html",
  "inventory.html",
  "weapon-detail.html",
  "settings.html",
];

let errors = 0;

function fail(message) {
  console.error(`ERROR: ${message}`);
  errors += 1;
}

if (!screens.meta?.figma?.includes("figma.com")) {
  fail("meta.figma must link to Figma file");
}

if (screens.meta?.desktopWidth !== 1280) {
  fail("meta.desktopWidth should be 1280");
}

if (!Array.isArray(screens.screens) || screens.screens.length < 5) {
  fail("screens must contain at least 5 entries");
}

const screenIds = screens.screens.map((s) => s.id);
for (const id of requiredScreenIds) {
  if (!screenIds.includes(id)) {
    fail(`missing screen id: ${id}`);
  }
}

const previewFiles = new Set();
for (const screen of screens.screens) {
  if (!screen.figmaFrame?.name) {
    fail(`screen ${screen.id}: missing figmaFrame.name`);
  }
  if (screen.file) {
    previewFiles.add(screen.file);
    const previewPath = resolve(previewsDir, screen.file);
    if (!existsSync(previewPath)) {
      fail(`missing preview file: design/previews/${screen.file} (screen ${screen.id})`);
    }
  }
}

for (const file of requiredPreviewFiles) {
  if (!existsSync(resolve(previewsDir, file))) {
    fail(`missing preview file: design/previews/${file}`);
  }
}

if (!existsSync(resolve(previewsDir, "shared.css"))) {
  fail("missing design/previews/shared.css");
}

if (!existsSync(resolve(previewsDir, "inventory-data.js"))) {
  fail("missing design/previews/inventory-data.js — run pnpm generate-inventory-preview");
}

if (!screens.annotations || Object.keys(screens.annotations).length < 3) {
  fail("annotations must document interaction states");
}

if (errors > 0) {
  console.error(`\n${errors} validation error(s).`);
  process.exit(1);
}

console.log(
  `OK: ${screens.screens.length} screens — previews: ${[...previewFiles].sort().join(", ")}`,
);
