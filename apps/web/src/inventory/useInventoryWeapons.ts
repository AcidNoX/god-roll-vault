import { BungieClient, type AuthTokens, type InventoryWeapon } from "@god-roll-vault/api";
import { useEffect, useState } from "react";

import { getBungieApiConfig } from "../auth/config.js";
import type { SelectedCharacter } from "../characters/selected-character.js";

type UseInventoryWeaponsOptions = {
  reloadToken: number;
  selectedCharacter: SelectedCharacter | null;
  tokens: AuthTokens | null;
};

type UseInventoryWeaponsResult = {
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  weapons: InventoryWeapon[];
};

export function useInventoryWeapons({
  reloadToken,
  selectedCharacter,
  tokens,
}: UseInventoryWeaponsOptions): UseInventoryWeaponsResult {
  const [weapons, setWeapons] = useState<InventoryWeapon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadWeapons() {
      if (!selectedCharacter) {
        setWeapons([]);
        setError(null);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (!tokens) {
        setWeapons([]);
        setError("Sign in again to load your Destiny weapons.");
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (reloadToken === 0) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      try {
        const { apiKey } = getBungieApiConfig();
        const client = new BungieClient({
          apiKey,
          accessToken: tokens.accessToken,
        });
        const inventoryWeapons = await client.getWeapons(
          selectedCharacter.membershipType,
          selectedCharacter.membershipId,
          selectedCharacter.characterId,
        );

        if (!cancelled) {
          setWeapons(inventoryWeapons);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load weapons.");
          setWeapons([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    }

    void loadWeapons();

    return () => {
      cancelled = true;
    };
  }, [tokens, selectedCharacter, reloadToken]);

  return {
    error,
    isLoading,
    isRefreshing,
    weapons,
  };
}
