import { evaluateInventory, type GameMode, type InventoryEvaluation } from "@god-roll-vault/core";
import { godRollDefinitions } from "@god-roll-vault/destiny-data";
import {
  Box,
  EmptyState,
  ErrorState,
  LoadingSpinner,
  Screen,
  Stack,
  Text,
  useTheme,
  WeaponCard,
} from "@god-roll-vault/ui";
import { type ChangeEvent, type CSSProperties, useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider.js";
import {
  createWeaponDetailPath,
  GAME_MODE_OPTIONS,
  readGameModeFromSearchParams,
  resolveSelectedCharacter,
} from "../inventory/routes.js";
import { useInventoryWeapons } from "../inventory/useInventoryWeapons.js";

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

export function InventoryPage() {
  const { logout, tokens } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const selectedCharacter = useMemo(() => resolveSelectedCharacter(searchParams), [searchParams]);
  const mode = useMemo(() => readGameModeFromSearchParams(searchParams), [searchParams]);
  const [searchQuery, setSearchQuery] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const { error, isLoading, isRefreshing, weapons } = useInventoryWeapons({
    reloadToken,
    selectedCharacter,
    tokens,
  });

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

  const handleRefresh = useCallback(() => {
    setReloadToken((current) => current + 1);
  }, []);

  const handleModeChange = useCallback(
    (nextMode: GameMode) => {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.set("mode", nextMode);
      setSearchParams(nextSearchParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

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
              <Text color="textMuted" testID="inventory-membership-id" variant="caption">
                Membership: {tokens.membershipId}
              </Text>
            ) : null}
            {selectedCharacter ? (
              <Text color="textMuted" testID="inventory-selected-character" variant="caption">
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
                  onClick={() => handleModeChange(option.mode)}
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
              {visibleEvaluations.map((evaluation) => (
                <WeaponCard
                  key={evaluation.weapon.itemInstanceId}
                  matchResult={evaluation.result}
                  onPress={() =>
                    navigate(
                      createWeaponDetailPath(
                        evaluation.weapon.itemInstanceId,
                        selectedCharacter,
                        mode,
                      ),
                    )
                  }
                  weapon={evaluation.weapon}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Screen>
  );
}
