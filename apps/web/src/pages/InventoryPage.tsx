import { BungieClient, type InventoryWeapon } from "@god-roll-vault/api";
import {
  evaluateInventory,
  type GameMode,
  type InventoryEvaluation,
  type MatchStatus,
  type WeaponPerks,
} from "@god-roll-vault/core";
import { godRollDefinitions } from "@god-roll-vault/destiny-data";
import {
  Box,
  EmptyState,
  ErrorState,
  LoadingSpinner,
  PerkList,
  Screen,
  Stack,
  Text,
  useTheme,
  WeaponCard,
} from "@god-roll-vault/ui";
import {
  type ChangeEvent,
  type CSSProperties,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider.js";
import { getBungieApiConfig } from "../auth/config.js";
import { readSelectedCharacter, type SelectedCharacter } from "../characters/selected-character.js";

const GAME_MODE_OPTIONS: Array<{ mode: GameMode; label: string }> = [
  { mode: "pve", label: "PVE" },
  { mode: "pvp", label: "PVP" },
];

function readSelectionFromSearchParams(searchParams: URLSearchParams): SelectedCharacter | null {
  const membershipType = Number(searchParams.get("membershipType"));
  const membershipId = searchParams.get("membershipId");
  const characterId = searchParams.get("characterId");

  if (!Number.isFinite(membershipType) || !membershipId || !characterId) {
    return null;
  }

  return {
    membershipType,
    membershipId,
    characterId,
  };
}

function sortInventoryEvaluations(evaluations: InventoryEvaluation[]): InventoryEvaluation[] {
  return [...evaluations].sort((left, right) => {
    const leftGodRoll = left.result.status === "perfect" ? 1 : 0;
    const rightGodRoll = right.result.status === "perfect" ? 1 : 0;

    if (leftGodRoll !== rightGodRoll) {
      return rightGodRoll - leftGodRoll;
    }

    if (left.weapon.power !== right.weapon.power) {
      return right.weapon.power - left.weapon.power;
    }

    return left.weapon.name.localeCompare(right.weapon.name);
  });
}

function filterInventoryEvaluations(
  evaluations: InventoryEvaluation[],
  searchQuery: string,
): InventoryEvaluation[] {
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  if (!normalizedQuery) {
    return evaluations;
  }

  return evaluations.filter((evaluation) =>
    evaluation.weapon.name.toLocaleLowerCase().includes(normalizedQuery),
  );
}

function toWeaponPerks(perks: InventoryWeapon["perks"]): WeaponPerks {
  const [barrel, magazine, perk1, perk2, originTrait] = perks;

  return {
    barrel,
    magazine,
    perk1,
    perk2,
    originTrait,
  };
}

function formatMatchStatus(status: MatchStatus): string {
  switch (status) {
    case "perfect":
      return "God Roll";
    case "partial":
      return "Partial";
    case "missing":
      return "Missing";
    case "unknown":
      return "Unknown";
  }
}

export function InventoryPage() {
  const { logout, tokens } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const selectedCharacter = useMemo(
    () => readSelectionFromSearchParams(searchParams) ?? readSelectedCharacter(),
    [searchParams],
  );
  const [mode, setMode] = useState<GameMode>("pve");
  const [searchQuery, setSearchQuery] = useState("");
  const [weapons, setWeapons] = useState<InventoryWeapon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [selectedWeaponId, setSelectedWeaponId] = useState<string | null>(null);

  const buttonStyle: CSSProperties = {
    backgroundColor: theme.colors.surfaceMuted,
    border: `1px solid ${theme.colors.borderStrong}`,
    borderRadius: theme.borderRadius.sm,
    color: theme.colors.text,
    cursor: "pointer",
    fontSize: theme.typography.fontSize.body,
    marginTop: theme.spacing.lg,
    padding: `${theme.spacing.md}px ${theme.spacing.xl}px`,
  };
  const compactButtonStyle: CSSProperties = {
    ...buttonStyle,
    marginTop: 0,
    padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
  };
  const inputStyle: CSSProperties = {
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.borderStrong}`,
    borderRadius: theme.borderRadius.sm,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.body,
    minWidth: 220,
    padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
  };
  const metadataTextStyle = {
    display: "block",
    lineHeight: theme.typography.lineHeight.caption + 2,
  } satisfies CSSProperties;

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

  const evaluations = useMemo(
    () => evaluateInventory(weapons, godRollDefinitions, mode),
    [weapons, mode],
  );
  const visibleEvaluations = useMemo(
    () => filterInventoryEvaluations(sortInventoryEvaluations(evaluations), searchQuery),
    [evaluations, searchQuery],
  );
  const godRollCount = evaluations.filter(
    (evaluation) => evaluation.result.status === "perfect",
  ).length;
  const godRollLabel = godRollCount === 1 ? "god roll" : "god rolls";
  const selectedEvaluation = useMemo(
    () =>
      selectedWeaponId
        ? (evaluations.find(
            (evaluation) => evaluation.weapon.itemInstanceId === selectedWeaponId,
          ) ?? null)
        : null,
    [evaluations, selectedWeaponId],
  );

  useEffect(() => {
    if (!selectedWeaponId) {
      return;
    }

    const selectedWeaponStillExists = weapons.some(
      (weapon) => weapon.itemInstanceId === selectedWeaponId,
    );

    if (!selectedWeaponStillExists) {
      setSelectedWeaponId(null);
    }
  }, [selectedWeaponId, weapons]);

  const handleRefresh = useCallback(() => {
    setReloadToken((current) => current + 1);
  }, []);

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  return (
    <Screen testID="inventory-page">
      <Stack gap="xl" style={{ maxWidth: 960, width: "100%" }}>
        <Stack direction="horizontal" gap="lg" justify="space-between" wrap>
          <Stack gap="xs" style={{ flex: 1, minWidth: 240 }}>
            <Text testID="inventory-title" variant="heading">
              Weapon inventory
            </Text>
            <Text color="textMuted" testID="inventory-subtitle">
              Review selected character and vault weapons against curated god rolls.
            </Text>
            {tokens?.membershipId ? (
              <Text
                color="textMuted"
                style={metadataTextStyle}
                testID="inventory-membership-id"
                variant="caption"
              >
                Membership: {tokens.membershipId}
              </Text>
            ) : null}
            {selectedCharacter ? (
              <Text
                color="textMuted"
                style={metadataTextStyle}
                testID="inventory-selected-character"
                variant="caption"
              >
                Character: {selectedCharacter.characterId}
              </Text>
            ) : null}
          </Stack>

          <Stack direction="horizontal" gap="sm" wrap>
            <button
              data-testid="inventory-refresh-button"
              disabled={isLoading || isRefreshing || !selectedCharacter}
              onClick={handleRefresh}
              style={{
                ...compactButtonStyle,
                opacity: isLoading || isRefreshing || !selectedCharacter ? 0.6 : 1,
              }}
              type="button"
            >
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              data-testid="sign-out"
              onClick={() => void logout()}
              style={compactButtonStyle}
              type="button"
            >
              Sign out
            </button>
          </Stack>
        </Stack>

        <Stack
          direction="horizontal"
          gap="md"
          style={{
            alignItems: "center",
            backgroundColor: theme.colors.surfaceRaised,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.lg,
            borderWidth: 1,
            padding: theme.spacing.lg,
          }}
          wrap
        >
          <Stack direction="horizontal" gap="sm">
            {GAME_MODE_OPTIONS.map((option) => {
              const selected = mode === option.mode;

              return (
                <button
                  aria-pressed={selected}
                  data-testid={`inventory-mode-${option.mode}`}
                  key={option.mode}
                  onClick={() => setMode(option.mode)}
                  style={{
                    ...compactButtonStyle,
                    backgroundColor: selected
                      ? theme.colors.accent.void
                      : theme.colors.surfaceMuted,
                    borderColor: selected ? theme.colors.accent.gold : theme.colors.borderStrong,
                  }}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </Stack>

          <input
            aria-label="Search weapon name"
            data-testid="inventory-search-input"
            onChange={handleSearchChange}
            placeholder="Search weapon name"
            style={inputStyle}
            type="search"
            value={searchQuery}
          />

          <Text color="textMuted" testID="inventory-summary" variant="caption">
            {evaluations.length} weapons, {godRollCount} {godRollLabel} in {mode.toUpperCase()}
          </Text>
        </Stack>

        {!selectedCharacter ? (
          <Stack align="center" gap="md">
            <EmptyState
              icon="?"
              message="Choose a character before reviewing your weapon inventory."
              testID="inventory-empty-selection"
            />
            <button
              data-testid="inventory-choose-character"
              onClick={() => navigate("/characters")}
              style={compactButtonStyle}
              type="button"
            >
              Choose character
            </button>
          </Stack>
        ) : isLoading ? (
          <Stack align="center" gap="md" padding="xl" testID="inventory-loading">
            <LoadingSpinner testID="inventory-loading-spinner" />
            <Text color="textMuted">Loading weapons...</Text>
          </Stack>
        ) : error ? (
          <ErrorState message={error} onRetry={handleRefresh} testID="inventory-error" />
        ) : weapons.length === 0 ? (
          <EmptyState
            icon="?"
            message="No character or vault weapons were found for this selection."
            testID="inventory-empty"
          />
        ) : visibleEvaluations.length === 0 ? (
          <EmptyState
            icon="?"
            message="No weapons match your search."
            testID="inventory-empty-search"
          />
        ) : (
          <Box testID="weapon-inventory-list">
            <Stack gap="md">
              {visibleEvaluations.map((evaluation) => {
                const detailIsOpen =
                  selectedEvaluation?.weapon.itemInstanceId === evaluation.weapon.itemInstanceId;

                return (
                  <Fragment key={evaluation.weapon.itemInstanceId}>
                    <WeaponCard
                      matchResult={evaluation.result}
                      onPress={() => setSelectedWeaponId(evaluation.weapon.itemInstanceId)}
                      weapon={evaluation.weapon}
                    />
                    {detailIsOpen ? (
                      <Box
                        padding="lg"
                        style={{
                          backgroundColor: theme.colors.surfaceRaised,
                          borderColor: theme.colors.border,
                          borderRadius: theme.borderRadius.lg,
                          borderWidth: 1,
                        }}
                        testID={`weapon-detail-${selectedEvaluation.weapon.itemInstanceId}`}
                      >
                        <Stack gap="md">
                          <Stack gap="xs">
                            <Text testID="weapon-detail-title" variant="heading">
                              {selectedEvaluation.weapon.name}
                            </Text>
                            <Text color="textMuted" testID="weapon-detail-status" variant="caption">
                              {formatMatchStatus(selectedEvaluation.result.status)} in{" "}
                              {mode.toUpperCase()} ({selectedEvaluation.result.score}% match)
                            </Text>
                          </Stack>

                          <PerkList
                            matchResult={selectedEvaluation.result}
                            perks={toWeaponPerks(selectedEvaluation.weapon.perks)}
                            testID={`weapon-detail-${selectedEvaluation.weapon.itemInstanceId}-perk-list`}
                          />
                        </Stack>
                      </Box>
                    ) : null}
                  </Fragment>
                );
              })}
            </Stack>
          </Box>
        )}
      </Stack>
    </Screen>
  );
}
