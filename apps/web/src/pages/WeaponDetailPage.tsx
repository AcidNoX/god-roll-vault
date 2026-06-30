import {
  type GameMode,
  type GodRollPerkSlot,
  groupInventoryByWeapon,
  type InstanceDisposition,
  type InventoryEvaluation,
  type MatchStatus,
  type WeaponElement,
} from "@god-roll-vault/core";
import { godRollDefinitions } from "@god-roll-vault/destiny-data";
import {
  Box,
  EmptyState,
  ErrorState,
  GodRollBadge,
  Image,
  LoadingSpinner,
  PerkList,
  Screen,
  Stack,
  Text,
  useTheme,
} from "@god-roll-vault/ui";
import { type CSSProperties, useCallback, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider.js";
import {
  createInventoryPath,
  createWeaponDetailPath,
  GAME_MODE_OPTIONS,
  readGameModeFromSearchParams,
  resolveSelectedCharacter,
  toWeaponPerks,
} from "../inventory/routes.js";
import { useInventoryWeapons } from "../inventory/useInventoryWeapons.js";

const SLOT_LABELS: Record<GodRollPerkSlot, string> = {
  barrel: "Barrel",
  magazine: "Mag",
  perk1: "Perk 1",
  perk2: "Perk 2",
};

const ELEMENT_DETAILS: Record<WeaponElement, { icon: string; label: string }> = {
  kinetic: { icon: "K", label: "Kinetic" },
  arc: { icon: "A", label: "Arc" },
  solar: { icon: "So", label: "Solar" },
  void: { icon: "V", label: "Void" },
  stasis: { icon: "St", label: "Stasis" },
  strand: { icon: "Sr", label: "Strand" },
  unknown: { icon: "?", label: "Unknown" },
};

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

function formatDisposition(disposition: InstanceDisposition): string {
  switch (disposition) {
    case "keep":
      return "Keep";
    case "dismantle":
      return "Dismantle";
    case "consider":
      return "Consider";
    case "only":
      return "Only copy";
  }
}

function findEvaluation(
  evaluations: InventoryEvaluation[],
  itemInstanceId: string | undefined,
): InventoryEvaluation | null {
  if (!itemInstanceId) {
    return null;
  }

  return (
    evaluations.find((evaluation) => evaluation.weapon.itemInstanceId === itemInstanceId) ?? null
  );
}

export function WeaponDetailPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { itemInstanceId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const selectedCharacter = useMemo(() => resolveSelectedCharacter(searchParams), [searchParams]);
  const mode = useMemo(() => readGameModeFromSearchParams(searchParams), [searchParams]);
  const [reloadToken, setReloadToken] = useState(0);
  const { error, isLoading, isRefreshing, weapons } = useInventoryWeapons({
    reloadToken,
    selectedCharacter,
  });
  const evaluations = useMemo(
    () =>
      groupInventoryByWeapon(weapons, godRollDefinitions, mode).flatMap((group) =>
        group.instances.map((instance) => instance.evaluation),
      ),
    [weapons, mode],
  );
  const weaponGroup = useMemo(() => {
    if (!itemInstanceId) {
      return null;
    }

    return (
      groupInventoryByWeapon(weapons, godRollDefinitions, mode).find((group) =>
        group.instances.some(
          (instance) => instance.evaluation.weapon.itemInstanceId === itemInstanceId,
        ),
      ) ?? null
    );
  }, [itemInstanceId, mode, weapons]);
  const evaluation = useMemo(
    () => findEvaluation(evaluations, itemInstanceId),
    [evaluations, itemInstanceId],
  );

  const buttonStyle: CSSProperties = {
    backgroundColor: theme.colors.surfaceMuted,
    border: `1px solid ${theme.colors.borderStrong}`,
    borderRadius: theme.borderRadius.sm,
    color: theme.colors.text,
    cursor: "pointer",
    fontSize: theme.typography.fontSize.body,
    padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
  };

  const handleBack = useCallback(() => {
    navigate(createInventoryPath(selectedCharacter, mode));
  }, [mode, navigate, selectedCharacter]);

  const handleModeChange = useCallback(
    (nextMode: GameMode) => {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.set("mode", nextMode);
      setSearchParams(nextSearchParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const handleSelectCopy = useCallback(
    (nextInstanceId: string) => {
      if (!selectedCharacter || nextInstanceId === itemInstanceId) {
        return;
      }

      navigate(createWeaponDetailPath(nextInstanceId, selectedCharacter, mode));
    },
    [itemInstanceId, mode, navigate, selectedCharacter],
  );

  const handleRefresh = useCallback(() => {
    setReloadToken((current) => current + 1);
  }, []);

  const renderBody = () => {
    if (!selectedCharacter) {
      return (
        <Stack align="center" gap="md">
          <EmptyState
            icon="?"
            message="Choose a character before reviewing this weapon."
            testID="weapon-detail-empty-selection"
          />
          <button
            data-testid="weapon-detail-choose-character"
            onClick={() => navigate("/characters")}
            style={buttonStyle}
            type="button"
          >
            Choose character
          </button>
        </Stack>
      );
    }

    if (isLoading) {
      return (
        <Stack align="center" gap="md" padding="xl" testID="weapon-detail-loading">
          <LoadingSpinner testID="weapon-detail-loading-spinner" />
          <Text color="textMuted">Loading weapon...</Text>
        </Stack>
      );
    }

    if (error) {
      return <ErrorState message={error} onRetry={handleRefresh} testID="weapon-detail-error" />;
    }

    if (!evaluation) {
      return (
        <Stack align="center" gap="md">
          <EmptyState
            icon="?"
            message="This weapon was not found in the selected inventory."
            testID="weapon-detail-not-found"
          />
          <button
            data-testid="weapon-detail-not-found-back"
            onClick={handleBack}
            style={buttonStyle}
            type="button"
          >
            Back to inventory
          </button>
        </Stack>
      );
    }

    const { result, weapon } = evaluation;
    const element = ELEMENT_DETAILS[weapon.element];
    const detailTestID = `weapon-detail-${weapon.itemInstanceId}`;

    return (
      <Stack gap="xl" testID={detailTestID}>
        <Box
          padding="lg"
          style={{
            backgroundColor: theme.colors.surfaceRaised,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.lg,
            borderWidth: 1,
          }}
        >
          <Stack gap="lg">
            <Stack direction="horizontal" gap="lg" justify="space-between" wrap>
              <Stack direction="horizontal" gap="md" style={{ flex: 1, minWidth: 260 }}>
                {weapon.iconUrl ? (
                  <Box
                    accessibilityLabel={`${weapon.name} icon`}
                    style={{
                      backgroundColor: theme.colors.surfaceMuted,
                      borderColor: theme.colors.border,
                      borderRadius: theme.borderRadius.lg,
                      borderWidth: 1,
                      height: 48,
                      overflow: "hidden",
                      width: 48,
                    }}
                    testID="weapon-detail-icon"
                  >
                    <Image
                      accessibilityLabel={`${weapon.name} icon`}
                      sourceUri={weapon.iconUrl}
                      style={{
                        height: "100%",
                        width: "100%",
                      }}
                      testID="weapon-detail-icon-image"
                    />
                  </Box>
                ) : (
                  <Box
                    accessibilityLabel={`${element.label} weapon icon`}
                    padding="md"
                    style={{
                      alignItems: "center",
                      backgroundColor: theme.colors.element[weapon.element].background,
                      borderColor: theme.colors.element[weapon.element].border,
                      borderRadius: theme.borderRadius.lg,
                      borderWidth: 1,
                      height: 48,
                      justifyContent: "center",
                      width: 48,
                    }}
                    testID="weapon-detail-icon"
                  >
                    <Text
                      style={{
                        color: theme.colors.element[weapon.element].text,
                        fontWeight: "700",
                      }}
                      variant="caption"
                    >
                      {element.icon}
                    </Text>
                  </Box>
                )}

                <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
                  <Text testID="weapon-detail-title" variant="heading">
                    {weapon.name}
                  </Text>
                  <Text color="textMuted" testID="weapon-detail-status" variant="caption">
                    {formatMatchStatus(result.status)} in {mode.toUpperCase()} ({result.score}%
                    match)
                  </Text>
                </Stack>
              </Stack>

              <GodRollBadge
                mode={mode}
                score={result.score}
                status={result.status}
                testID="weapon-detail-god-roll-badge"
              />
            </Stack>

            <Stack direction="horizontal" gap="sm" testID="weapon-detail-metadata" wrap>
              <Text color="textMuted" testID="weapon-detail-power" variant="caption">
                Power {weapon.power}
              </Text>
              <Text color="textMuted" testID="weapon-detail-element" variant="caption">
                {element.label} element
              </Text>
              <Text color="textMuted" testID="weapon-detail-tier" variant="caption">
                {weapon.tier}
              </Text>
              <Text color="textMuted" testID="weapon-detail-location" variant="caption">
                {weapon.location === "vault" ? "Vault" : "Character"}
                {weapon.isEquipped ? " - Equipped" : ""}
              </Text>
            </Stack>
          </Stack>
        </Box>

        {weaponGroup && weaponGroup.copyCount > 1 ? (
          <Box
            padding="lg"
            style={{
              backgroundColor: theme.colors.surfaceRaised,
              borderColor: theme.colors.border,
              borderRadius: theme.borderRadius.lg,
              borderWidth: 1,
            }}
            testID="weapon-detail-copies"
          >
            <Stack gap="md">
              <Text variant="heading">Your copies</Text>
              <Text color="textMuted" testID="weapon-detail-copies-summary" variant="caption">
                Recommended keeper:{" "}
                {weaponGroup.keeper.weapon.itemInstanceId === itemInstanceId
                  ? "this roll"
                  : `power ${weaponGroup.keeper.weapon.power}`}
              </Text>
              <Stack gap="sm">
                {weaponGroup.instances.map((instance) => {
                  const copy = instance.evaluation;
                  const selected = copy.weapon.itemInstanceId === weapon.itemInstanceId;
                  const isKeeper =
                    copy.weapon.itemInstanceId === weaponGroup.keeper.weapon.itemInstanceId;

                  return (
                    <button
                      data-testid={`weapon-detail-copy-${copy.weapon.itemInstanceId}`}
                      key={copy.weapon.itemInstanceId}
                      onClick={() => handleSelectCopy(copy.weapon.itemInstanceId)}
                      style={{
                        ...buttonStyle,
                        backgroundColor: selected
                          ? theme.colors.surface
                          : theme.colors.surfaceMuted,
                        borderColor: selected
                          ? theme.colors.accent.gold
                          : theme.colors.borderStrong,
                        textAlign: "left",
                        width: "100%",
                      }}
                      type="button"
                    >
                      <Stack gap="xs">
                        <Stack direction="horizontal" gap="sm" wrap>
                          <Text>#{instance.rank}</Text>
                          <Text>Power {copy.weapon.power}</Text>
                          <Text color="textMuted" variant="caption">
                            {formatMatchStatus(copy.result.status)} ({copy.result.score}%)
                          </Text>
                          <Text color="textMuted" variant="caption">
                            {formatDisposition(instance.disposition)}
                          </Text>
                          {isKeeper ? (
                            <Text color="textMuted" variant="caption">
                              Recommended keeper
                            </Text>
                          ) : null}
                          {selected ? (
                            <Text color="textMuted" variant="caption">
                              Inspecting
                            </Text>
                          ) : null}
                        </Stack>
                      </Stack>
                    </button>
                  );
                })}
              </Stack>
            </Stack>
          </Box>
        ) : null}

        <Box
          padding="lg"
          style={{
            backgroundColor: theme.colors.surfaceRaised,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.lg,
            borderWidth: 1,
          }}
          testID="weapon-detail-roll-breakdown"
        >
          <Stack gap="md">
            <Text variant="heading">Current roll</Text>
            <PerkList
              matchResult={result}
              perks={toWeaponPerks(weapon.perks)}
              testID={`${detailTestID}-perk-list`}
            />
          </Stack>
        </Box>

        <Box
          padding="lg"
          style={{
            backgroundColor: theme.colors.surfaceRaised,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.lg,
            borderWidth: 1,
          }}
          testID="weapon-detail-target-perks"
        >
          <Stack gap="md">
            <Text variant="heading">Target god roll</Text>
            {result.details.length > 0 ? (
              <Stack gap="sm">
                {result.details.map((detail) => (
                  <Stack
                    direction="horizontal"
                    gap="md"
                    justify="space-between"
                    key={detail.slot}
                    padding="md"
                    style={{
                      backgroundColor: theme.colors.surface,
                      borderColor: detail.matched
                        ? theme.colors.badge.perfect.border
                        : theme.colors.badge.missing.border,
                      borderRadius: theme.borderRadius.md,
                      borderWidth: 1,
                    }}
                    testID={`weapon-detail-target-${detail.slot}`}
                    wrap
                  >
                    <Text color="textMuted" variant="caption">
                      {SLOT_LABELS[detail.slot]}
                    </Text>
                    <Text>{detail.target}</Text>
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Text color="textMuted" testID="weapon-detail-target-empty">
                No curated {mode.toUpperCase()} god roll target exists for this weapon yet.
              </Text>
            )}
          </Stack>
        </Box>
      </Stack>
    );
  };

  return (
    <Screen testID="weapon-detail-page">
      <Stack gap="xl" style={{ maxWidth: 960, width: "100%" }}>
        <Stack direction="horizontal" gap="lg" justify="space-between" wrap>
          <button
            data-testid="weapon-detail-back-button"
            onClick={handleBack}
            style={buttonStyle}
            type="button"
          >
            Back to inventory
          </button>

          <Stack direction="horizontal" gap="sm" wrap>
            {GAME_MODE_OPTIONS.map((option) => {
              const selected = mode === option.mode;

              return (
                <button
                  aria-pressed={selected}
                  data-testid={`weapon-detail-mode-${option.mode}`}
                  key={option.mode}
                  onClick={() => handleModeChange(option.mode)}
                  style={{
                    ...buttonStyle,
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
            <button
              data-testid="weapon-detail-refresh-button"
              disabled={isLoading || isRefreshing || !selectedCharacter}
              onClick={handleRefresh}
              style={{
                ...buttonStyle,
                opacity: isLoading || isRefreshing || !selectedCharacter ? 0.6 : 1,
              }}
              type="button"
            >
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              data-testid="sign-out"
              onClick={() => void logout()}
              style={buttonStyle}
              type="button"
            >
              Sign out
            </button>
          </Stack>
        </Stack>

        {renderBody()}
      </Stack>
    </Screen>
  );
}
