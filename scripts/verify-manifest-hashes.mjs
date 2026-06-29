/**
 * One-off curation helper: verify hashes via Bungie entity API and emit manifest JSON.
 * Run manually when updating packages/destiny-data/src/manifest/*.json — see docs/destiny-data.md.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const envPath = resolve(root, ".env");
const manifestDir = resolve(root, "packages/destiny-data/src/manifest");

const apiKey = readFileSync(envPath, "utf8")
  .split("\n")
  .find((line) => line.startsWith("BUNGIE_API_KEY="))
  ?.slice("BUNGIE_API_KEY=".length)
  .trim();

if (!apiKey) {
  throw new Error("BUNGIE_API_KEY not found in .env");
}

// Hashes from light.gg item URLs (see docs/destiny-data.md).
const weaponHashes = [
  // LEE-38 fixtures (overridden below after fetch)
  1363886209, 2595497736, 3687335430,
  // Exotics
  347366834, 1891561814, 1364093401, 3211806999, 3973202132, 3654674561, 2812324400, 3849355625,
  1363369977, 3446426169, 3059584449, 3482594692, 3849355628, 2398400852, 1568451523, 2553515248,
  // Pinnacle / ritual / raid favorites
  3098328572, 4043921923, 235827225, 4190932264, 1481892490, 4077588826, 1216319404, 4219826183,
  2429822977, 2563012876, 3843477312, 2533990645, 1896309757, 614426548, 613334176, 3652506829,
  2763843898, 2186258845, 3565520715, 3621336854, 1911060537, 1274330687, 2374570468, 1959267927,
  2821672368, 4104122452, 2809991800, 3089417789, 3027226382, 776529595, 3643424740, 3171547797,
  3960926756, 4246159128, 768621510, 400096939, 2886339027, 431721920, 2119346509, 3856705927,
  4152016199, 882778888, 1973107014, 2314610827, 4067556514, 892183998, 2357297366, 4103414242,
  4255171531, 4227181568, 46524085, 3055790362,
];

const plugHashes = [
  1467527085, 3177301540, 1820237385, 1710791522, 2847525152, 3824105627, 3038247973, 3425386926,
  3142289711, 3400784728, 2213355989, 3250034553, 957782887, 1890422124, 3300816228, 1066598837,
  1168162263, 1015611457, 3036497950, 2392476562, 1482024992, 839105230, 4090651448, 106909392,
  3891536761, 588594999, 3700496672, 4104185692, 3523296417, 1546637391, 1820434877, 1840239774,
  3436456273, 2697524718, 3911006063, 1906147655, 3437894882,
];

const weaponTypes = new Set([
  "Auto Rifle",
  "Hand Cannon",
  "Pulse Rifle",
  "Scout Rifle",
  "Submachine Gun",
  "Sidearm",
  "Shotgun",
  "Sniper Rifle",
  "Fusion Rifle",
  "Linear Fusion Rifle",
  "Grenade Launcher",
  "Rocket Launcher",
  "Combat Bow",
  "Sword",
  "Glaive",
  "Trace Rifle",
  "Machine Gun",
]);

async function fetchItem(hash) {
  const url = `https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${hash}/`;
  const res = await fetch(url, { headers: { "X-API-Key": apiKey } });
  if (!res.ok) return null;
  const body = await res.json();
  const item = body.Response;
  if (!item?.displayProperties?.name) return null;
  return {
    hash,
    name: item.displayProperties.name,
    tier: item.inventory?.tierTypeName ?? "Unknown",
    type: item.itemTypeDisplayName ?? "",
  };
}

const weapons = {};
const plugs = {};

for (const hash of [...new Set(weaponHashes)]) {
  const item = await fetchItem(hash);
  if (item && (weaponTypes.has(item.type) || item.tier === "Exotic")) {
    weapons[String(hash)] = { name: item.name, tier: item.tier };
    console.log(`weapon OK ${hash} ${item.name}`);
  } else if (item) {
    console.log(`weapon SKIP ${hash} ${item.name} (${item.type})`);
  } else {
    console.log(`weapon MISS ${hash}`);
  }
  await new Promise((r) => setTimeout(r, 120));
}

for (const hash of [...new Set(plugHashes)]) {
  const item = await fetchItem(hash);
  if (item && !weaponTypes.has(item.type)) {
    plugs[String(hash)] = { name: item.name };
    console.log(`plug OK ${hash} ${item.name}`);
  } else if (item) {
    console.log(`plug SKIP ${hash} ${item.name} (${item.type})`);
  } else {
    console.log(`plug MISS ${hash}`);
  }
  await new Promise((r) => setTimeout(r, 120));
}

// LEE-38 fixture overrides — must remain for inventory mapper tests.
weapons["1363886209"] = { name: "Fatebringer (Timelost)", tier: "Legendary" };
weapons["2595497736"] = { name: "Crafted Test Rifle", tier: "Legendary" };
weapons["3687335430"] = { name: "Vault Test Shotgun", tier: "Legendary" };

plugs["1467527085"] = { name: "Firefly" };
plugs["3177301540"] = { name: "Explosive Payload" };
plugs["1820237385"] = { name: "Fourth Times the Charm" };
plugs["1710791522"] = { name: "Rampage" };
plugs["2847525152"] = { name: "Accurized Rounds" };

const sortedWeapons = Object.fromEntries(
  Object.entries(weapons).sort(([a], [b]) => Number(a) - Number(b)),
);
const sortedPlugs = Object.fromEntries(
  Object.entries(plugs).sort(([a], [b]) => Number(a) - Number(b)),
);

writeFileSync(
  resolve(manifestDir, "mvp-weapons.json"),
  `${JSON.stringify(sortedWeapons, null, 2)}\n`,
);
writeFileSync(resolve(manifestDir, "mvp-plugs.json"), `${JSON.stringify(sortedPlugs, null, 2)}\n`);

console.log(
  `\nWrote ${Object.keys(sortedWeapons).length} weapons and ${Object.keys(sortedPlugs).length} plugs.`,
);
