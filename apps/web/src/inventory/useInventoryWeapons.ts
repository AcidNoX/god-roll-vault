import {
  BungieClient,
  enrichInventoryWeapons,
  formatApiError,
  type InventoryWeapon,
} from "@god-roll-vault/api";
import { useEffect, useState } from "react";

import { useAuth } from "../auth/AuthProvider.js";
import { getBungieApiConfig } from "../auth/config.js";
import type { SelectedCharacter } from "../characters/selected-character.js";

type UseInventoryWeaponsOptions = {
  reloadToken: number;
  selectedCharacter: SelectedCharacter | null;
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
}: UseInventoryWeaponsOptions): UseInventoryWeaponsResult {
  const { ensureValidTokens } = useAuth();
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

      if (reloadToken === 0) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      try {
        const tokens = await ensureValidTokens();
        if (!tokens) {
          throw new Error("Sign in again to load your Destiny weapons.");
        }

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
        const enrichedWeapons = await enrichInventoryWeapons(client, inventoryWeapons);

        if (!cancelled) {
          setWeapons(enrichedWeapons);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(formatApiError(loadError, "Unable to load weapons."));
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
  }, [ensureValidTokens, selectedCharacter, reloadToken]);

  return {
    error,
    isLoading,
    isRefreshing,
    weapons,
  };
}
