import type { InventoryWeapon, WeaponPerk } from "@god-roll-vault/core";
import {
  getPerkName,
  getWeaponName,
  getWeaponTier,
  isWeaponBucket,
} from "@god-roll-vault/destiny-data";

import type { DestinyItemComponent, DestinyProfileResponse } from "../schemas/profile.js";

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
    perks.push({
      plugHash: socket.plugHash,
      name: getPerkName(socket.plugHash),
    });
  }

  const reusablePlugs = profile.itemComponents?.reusablePlugs?.data[itemInstanceId]?.plugs;
  if (reusablePlugs) {
    for (const plugOptions of Object.values(reusablePlugs)) {
      for (const plug of plugOptions) {
        if (seenPlugHashes.has(plug.plugItemHash)) {
          continue;
        }

        seenPlugHashes.add(plug.plugItemHash);
        perks.push({
          plugHash: plug.plugItemHash,
          name: getPerkName(plug.plugItemHash),
        });
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

  if (!item.itemInstanceId || !isWeaponBucket(item.bucketHash)) {
    return null;
  }

  const instance = profile.itemComponents?.instances?.data[item.itemInstanceId];
  const equipped = isEquipped || instance?.isEquipped === true;

  return {
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
}

export function mapInventoryWeapons(
  profile: DestinyProfileResponse,
  characterId: string,
): InventoryWeapon[] {
  const sources = [...collectCharacterItems(profile, characterId), ...collectVaultItems(profile)];
  const weapons: InventoryWeapon[] = [];

  for (const source of sources) {
    const weapon = mapItemToWeapon(source, profile);
    if (weapon) {
      weapons.push(weapon);
    }
  }

  return weapons;
}
