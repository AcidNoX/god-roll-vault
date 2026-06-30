import type { InventoryWeapon, WeaponPerk } from "@god-roll-vault/core";
import {
  getPerkIconUrl,
  getPerkName,
  getWeaponDefinition,
  getWeaponIconUrl,
  getWeaponName,
  getWeaponTier,
  isWeaponBucket,
  isWeaponItemHash,
} from "@god-roll-vault/destiny-data";

import type { BungieClient } from "../client.js";
import type { DestinyItemComponent, DestinyProfileResponse } from "../schemas/profile.js";
import { prefetchInventoryItemDefinitions } from "./prefetch-manifest.js";

type ItemSource = {
  item: DestinyItemComponent;
  location: InventoryWeapon["location"];
  isEquipped: boolean;
};

const WEAPON_PROFILE_COMPONENTS = [102, 201, 205, 300, 305, 308] as const;

export const WEAPON_PROFILE_COMPONENT_IDS: number[] = [...WEAPON_PROFILE_COMPONENTS];

const DAMAGE_TYPE_HASH_TO_ELEMENT: Record<number, InventoryWeapon["element"]> = {
  3373582085: "kinetic",
  2303181850: "arc",
  1847026933: "solar",
  3454344768: "void",
  151347233: "stasis",
  3949783978: "strand",
};

function mapDamageTypeHashToElement(
  damageTypeHash: number | undefined,
): InventoryWeapon["element"] {
  if (!damageTypeHash) {
    return "unknown";
  }

  return DAMAGE_TYPE_HASH_TO_ELEMENT[damageTypeHash] ?? "unknown";
}

function createWeaponPerk(plugHash: number): WeaponPerk {
  const iconUrl = getPerkIconUrl(plugHash);
  const perk = {
    plugHash,
    name: getPerkName(plugHash),
  };

  return iconUrl ? { ...perk, iconUrl } : perk;
}

function collectCharacterItems(profile: DestinyProfileResponse, characterId: string): ItemSource[] {
  const sources: ItemSource[] = [];

  const inventory = profile.characterInventories?.[characterId]?.items ?? [];
  for (const item of inventory) {
    sources.push({ item, location: "character", isEquipped: false });
  }

  const equipment = profile.characterEquipment?.[characterId]?.items ?? [];
  for (const item of equipment) {
    sources.push({ item, location: "character", isEquipped: true });
  }

  return sources;
}

function collectAllCharacterItems(profile: DestinyProfileResponse): ItemSource[] {
  const characterIds = new Set([
    ...Object.keys(profile.characterInventories ?? {}),
    ...Object.keys(profile.characterEquipment ?? {}),
  ]);

  return [...characterIds].flatMap((characterId) => collectCharacterItems(profile, characterId));
}

function collectItemSources(profile: DestinyProfileResponse): ItemSource[] {
  return [...collectAllCharacterItems(profile), ...collectVaultItems(profile)];
}

function isWeaponItem(
  item: DestinyItemComponent,
): item is DestinyItemComponent & { itemInstanceId: string } {
  if (!item.itemInstanceId) {
    return false;
  }

  return isWeaponItemHash(item.itemHash) || isWeaponBucket(item.bucketHash);
}

function collectVaultItems(profile: DestinyProfileResponse): ItemSource[] {
  const vaultItems = profile.profileInventory?.items ?? [];
  return vaultItems.map((item) => ({
    item,
    location: "vault" as const,
    isEquipped: false,
  }));
}

export function extractWeaponPerks(
  itemInstanceId: string,
  profile: DestinyProfileResponse,
): WeaponPerk[] {
  const perks: WeaponPerk[] = [];
  const seenPlugHashes = new Set<number>();
  const sockets = profile.itemComponents?.sockets?.data[itemInstanceId]?.sockets ?? [];

  for (const socket of sockets) {
    if (!socket.plugHash || socket.isEnabled === false || socket.isVisible === false) {
      continue;
    }

    if (seenPlugHashes.has(socket.plugHash)) {
      continue;
    }

    seenPlugHashes.add(socket.plugHash);
    perks.push(createWeaponPerk(socket.plugHash));
  }

  const reusablePlugs = profile.itemComponents?.reusablePlugs?.data[itemInstanceId]?.plugs;
  if (reusablePlugs) {
    for (const plugOptions of Object.values(reusablePlugs)) {
      for (const plug of plugOptions) {
        if (seenPlugHashes.has(plug.plugItemHash)) {
          continue;
        }

        seenPlugHashes.add(plug.plugItemHash);
        perks.push(createWeaponPerk(plug.plugItemHash));
      }
    }
  }

  return perks;
}

function mapItemToWeapon(
  source: ItemSource,
  profile: DestinyProfileResponse,
): InventoryWeapon | null {
  const { item, location, isEquipped } = source;

  if (!isWeaponItem(item)) {
    return null;
  }

  const instance = profile.itemComponents?.instances?.data[item.itemInstanceId];
  const equipped = isEquipped || instance?.isEquipped === true;
  const iconUrl = getWeaponIconUrl(item.itemHash);

  const weapon: InventoryWeapon = {
    itemHash: item.itemHash,
    itemInstanceId: item.itemInstanceId,
    name: getWeaponName(item.itemHash),
    tier: getWeaponTier(item.itemHash),
    power: instance?.primaryStat?.value ?? 0,
    element: mapDamageTypeHashToElement(instance?.damageTypeHash),
    perks: extractWeaponPerks(item.itemInstanceId, profile),
    location,
    bucketHash: item.bucketHash,
    isEquipped: equipped,
  };

  return iconUrl ? { ...weapon, iconUrl } : weapon;
}

export function mapInventoryWeapons(
  profile: DestinyProfileResponse,
  _characterId?: string,
): InventoryWeapon[] {
  const sources = collectItemSources(profile);
  const weapons: InventoryWeapon[] = [];

  for (const source of sources) {
    const weapon = mapItemToWeapon(source, profile);
    if (weapon) {
      weapons.push(weapon);
    }
  }

  return weapons;
}

export async function buildInventoryWeapons(
  client: BungieClient,
  profile: DestinyProfileResponse,
): Promise<InventoryWeapon[]> {
  const itemHashes = collectItemSources(profile)
    .filter((source) => {
      if (!source.item.itemInstanceId) {
        return false;
      }

      if (isWeaponBucket(source.item.bucketHash)) {
        return false;
      }

      return !getWeaponDefinition(source.item.itemHash);
    })
    .map((source) => source.item.itemHash);

  await prefetchInventoryItemDefinitions(client, itemHashes);
  return mapInventoryWeapons(profile);
}
