import type { DestinyCharacter, DestinyMembership, InventoryWeapon } from "@god-roll-vault/core";
import type { z } from "zod";

import { BungieApiError } from "./errors.js";
import { mapCharacters, mapMemberships } from "./mappers/destiny.js";
import { mapInventoryWeapons, WEAPON_PROFILE_COMPONENT_IDS } from "./mappers/inventory.js";
import { destinyCharacterResponseSchema, destinyItemResponseSchema } from "./schemas/character.js";
import { BUNGIE_SUCCESS_ERROR_CODE, bungieEnvelopeSchema } from "./schemas/envelope.js";
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

  constructor(private readonly config: BungieClientConfig) {
    this.baseUrl = config.baseUrl ?? BUNGIE_API_BASE_URL;
    this.fetchFn = config.fetch ?? fetch;
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

  async getCharacters(membershipType: number, membershipId: string): Promise<DestinyCharacter[]> {
    const profile = await this.getProfile(membershipType, membershipId, [200]);
    return mapCharacters(profile);
  }

  async getWeapons(
    membershipType: number,
    membershipId: string,
    characterId: string,
  ): Promise<InventoryWeapon[]> {
    const profile = await this.getProfile(
      membershipType,
      membershipId,
      WEAPON_PROFILE_COMPONENT_IDS,
    );
    return mapInventoryWeapons(profile, characterId);
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
    const envelope = bungieEnvelopeSchema(responseSchema).parse(json);

    if (envelope.ErrorCode !== BUNGIE_SUCCESS_ERROR_CODE) {
      throw new BungieApiError(
        envelope.ErrorCode,
        envelope.ErrorStatus,
        envelope.Message,
        envelope.ThrottleSeconds,
        envelope.MessageData,
      );
    }

    return envelope.Response as z.output<T>;
  }
}
