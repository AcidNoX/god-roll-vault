import type { DestinyCharacter, DestinyMembership, InventoryWeapon } from "@god-roll-vault/core";
import type { SeasonDefinition, WeaponDefinition } from "@god-roll-vault/destiny-data";
import type { z } from "zod";
import { BungieApiError } from "./errors.js";
import { mapCharacters, mapMemberships, resolvePlayableMemberships } from "./mappers/destiny.js";
import { buildInventoryWeapons, WEAPON_PROFILE_COMPONENT_IDS } from "./mappers/inventory.js";
import { mapInventoryItemDefinition } from "./mappers/manifest.js";
import { mapSeasonDefinition } from "./mappers/manifest-season.js";
import { destinyCharacterResponseSchema, destinyItemResponseSchema } from "./schemas/character.js";
import { BUNGIE_SUCCESS_ERROR_CODE, bungieEnvelopeMetaSchema } from "./schemas/envelope.js";
import { destinyInventoryItemDefinitionSchema } from "./schemas/manifest-item.js";
import { destinySeasonDefinitionSchema } from "./schemas/manifest-season.js";
import { type UserMembershipData, userMembershipDataSchema } from "./schemas/memberships.js";
import { type DestinyProfileResponse, destinyProfileResponseSchema } from "./schemas/profile.js";

export const BUNGIE_API_BASE_URL = "https://www.bungie.net/Platform";

export type BungieClientConfig = {
  apiKey: string;
  baseUrl?: string;
  accessToken?: string;
  fetch?: typeof fetch;
};

export class BungieClient {
  private readonly baseUrl: string;
  private readonly fetchFn: typeof fetch;
  private readonly inventoryItemDefinitionCache = new Map<number, WeaponDefinition | null>();
  private readonly seasonDefinitionCache = new Map<number, SeasonDefinition | null>();

  constructor(private readonly config: BungieClientConfig) {
    this.baseUrl = config.baseUrl ?? BUNGIE_API_BASE_URL;
    this.fetchFn = config.fetch ?? globalThis.fetch.bind(globalThis);
  }

  getApiKey(): string {
    return this.config.apiKey;
  }

  async getMembershipsForCurrentUser(): Promise<UserMembershipData> {
    return this.request("/User/GetMembershipsForCurrentUser/", userMembershipDataSchema);
  }

  async getMemberships(): Promise<DestinyMembership[]> {
    const data = await this.getMembershipsForCurrentUser();
    return mapMemberships(data);
  }

  async getPlayableMemberships(): Promise<DestinyMembership[]> {
    const data = await this.getMembershipsForCurrentUser();
    return resolvePlayableMemberships(data);
  }

  async getCharacters(membershipType: number, membershipId: string): Promise<DestinyCharacter[]> {
    const profile = await this.getProfile(membershipType, membershipId, [200]);
    return mapCharacters(profile);
  }

  async getWeapons(
    membershipType: number,
    membershipId: string,
    _characterId: string,
  ): Promise<InventoryWeapon[]> {
    const profile = await this.getProfile(
      membershipType,
      membershipId,
      WEAPON_PROFILE_COMPONENT_IDS,
    );
    return buildInventoryWeapons(this, profile);
  }

  async getInventoryItemDefinition(itemHash: number): Promise<WeaponDefinition | null> {
    if (this.inventoryItemDefinitionCache.has(itemHash)) {
      return this.inventoryItemDefinitionCache.get(itemHash) ?? null;
    }

    try {
      const definition = await this.request(
        `/Destiny2/Manifest/DestinyInventoryItemDefinition/${itemHash}/`,
        destinyInventoryItemDefinitionSchema,
      );
      const mapped = mapInventoryItemDefinition(definition);
      this.inventoryItemDefinitionCache.set(itemHash, mapped);
      return mapped;
    } catch {
      this.inventoryItemDefinitionCache.set(itemHash, null);
      return null;
    }
  }

  async getSeasonDefinition(seasonHash: number): Promise<SeasonDefinition | null> {
    if (this.seasonDefinitionCache.has(seasonHash)) {
      return this.seasonDefinitionCache.get(seasonHash) ?? null;
    }

    try {
      const definition = await this.request(
        `/Destiny2/Manifest/DestinySeasonDefinition/${seasonHash}/`,
        destinySeasonDefinitionSchema,
      );
      const mapped = mapSeasonDefinition(definition);
      this.seasonDefinitionCache.set(seasonHash, mapped);
      return mapped;
    } catch {
      this.seasonDefinitionCache.set(seasonHash, null);
      return null;
    }
  }

  async getProfile(
    membershipType: number,
    destinyMembershipId: string,
    components: number[],
  ): Promise<DestinyProfileResponse> {
    const query = new URLSearchParams({
      components: components.join(","),
    });
    return this.request(
      `/Destiny2/${membershipType}/Profile/${destinyMembershipId}/?${query}`,
      destinyProfileResponseSchema,
    );
  }

  async getCharacter(
    membershipType: number,
    destinyMembershipId: string,
    characterId: string,
    components: number[] = [200, 201, 205],
  ) {
    const query = new URLSearchParams({
      components: components.join(","),
    });
    return this.request(
      `/Destiny2/${membershipType}/Profile/${destinyMembershipId}/Character/${characterId}/?${query}`,
      destinyCharacterResponseSchema,
    );
  }

  async getItem(
    membershipType: number,
    destinyMembershipId: string,
    itemInstanceId: string,
    components: number[] = [300, 305],
  ) {
    const query = new URLSearchParams({
      components: components.join(","),
    });
    return this.request(
      `/Destiny2/${membershipType}/Profile/${destinyMembershipId}/Item/${itemInstanceId}/?${query}`,
      destinyItemResponseSchema,
    );
  }

  private async request<T extends z.ZodTypeAny>(
    path: string,
    responseSchema: T,
    init?: RequestInit,
  ): Promise<z.output<T>> {
    const url = `${this.baseUrl.replace(/\/$/, "")}${path}`;
    const headers = new Headers(init?.headers);
    headers.set("X-API-Key", this.config.apiKey);

    if (this.config.accessToken) {
      headers.set("Authorization", `Bearer ${this.config.accessToken}`);
    }

    const response = await this.fetchFn(url, {
      ...init,
      headers,
    });

    const json: unknown = await response.json();
    const envelope = bungieEnvelopeMetaSchema.parse(json);

    if (envelope.ErrorCode !== BUNGIE_SUCCESS_ERROR_CODE) {
      throw new BungieApiError(
        envelope.ErrorCode,
        envelope.ErrorStatus,
        envelope.Message,
        envelope.ThrottleSeconds,
        envelope.MessageData,
      );
    }

    return responseSchema.parse(envelope.Response);
  }
}
