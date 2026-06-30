import {
  BungieClient,
  type DestinyCharacter,
  type DestinyMembership,
  formatApiError,
} from "@god-roll-vault/api";
import {
  Box,
  EmptyState,
  ErrorState,
  LoadingSpinner,
  Pressable,
  Screen,
  Stack,
  Text,
  useTheme,
} from "@god-roll-vault/ui";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider.js";
import { getBungieApiConfig } from "../auth/config.js";
import {
  readSelectedCharacter,
  type SelectedCharacter,
  writeSelectedCharacter,
} from "../characters/selected-character.js";

type CharacterOption = {
  membership: DestinyMembership;
  character: DestinyCharacter;
};

type ClassPresentation = {
  icon: string;
  label: string;
};

const UNKNOWN_CLASS_PRESENTATION: ClassPresentation = { icon: "?", label: "Unknown" };

const CLASS_PRESENTATION_BY_TYPE: Record<number, ClassPresentation> = {
  0: { icon: "T", label: "Titan" },
  1: { icon: "H", label: "Hunter" },
  2: { icon: "W", label: "Warlock" },
  3: UNKNOWN_CLASS_PRESENTATION,
};

function getClassPresentation(classType: number) {
  return CLASS_PRESENTATION_BY_TYPE[classType] ?? UNKNOWN_CLASS_PRESENTATION;
}

function formatLastPlayed(dateLastPlayed: string): string {
  const date = new Date(dateLastPlayed);
  if (Number.isNaN(date.getTime())) {
    return "Last played unknown";
  }

  return `Last played ${new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)}`;
}

function createInventoryUrl(selection: SelectedCharacter): string {
  const query = new URLSearchParams({
    membershipType: String(selection.membershipType),
    membershipId: selection.membershipId,
    characterId: selection.characterId,
  });

  return `/inventory?${query}`;
}

function matchesSelection(option: CharacterOption, selection: SelectedCharacter | null): boolean {
  return (
    selection?.membershipType === option.membership.membershipType &&
    selection.membershipId === option.membership.membershipId &&
    selection.characterId === option.character.characterId
  );
}

type CharacterCardProps = {
  option: CharacterOption;
  isSelected: boolean;
  onSelect: () => void;
};

function CharacterCard({ option, isSelected, onSelect }: CharacterCardProps) {
  const theme = useTheme();
  const { character, membership } = option;
  const characterClass = getClassPresentation(character.classType);
  const cardTestID = `character-card-${character.characterId}`;

  const cardStyle = {
    alignItems: "stretch",
    backgroundColor: theme.colors.surfaceRaised,
    borderColor: isSelected ? theme.colors.accent.gold : theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    borderWidth: isSelected ? 2 : 1,
    flexBasis: 280,
    flexGrow: 1,
    maxWidth: 420,
    minWidth: 260,
    padding: theme.spacing.lg,
  } as const;
  const iconStyle = {
    alignItems: "center",
    backgroundColor: theme.colors.accent.voidMuted,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.borderRadius.pill,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48,
  } as const;
  const iconTextStyle = {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "700",
  } as const;
  const lightStyle = {
    color: theme.colors.accent.gold,
    fontSize: 28,
    fontWeight: "700",
  } as const;

  return (
    <Pressable
      accessibilityLabel={`${characterClass.label}, power ${character.light}, ${formatLastPlayed(
        character.dateLastPlayed,
      )}`}
      onPress={onSelect}
      style={({ hovered, pressed }) => [
        cardStyle,
        hovered || pressed ? { borderColor: theme.colors.accent.gold } : undefined,
      ]}
      testID={cardTestID}
    >
      <Stack direction="horizontal" gap="md" justify="space-between">
        <Stack direction="horizontal" gap="md" style={{ flex: 1 }}>
          <Box
            accessibilityLabel={`${characterClass.label} class icon`}
            style={iconStyle}
            testID={`${cardTestID}-class-icon`}
          >
            <Text style={iconTextStyle}>{characterClass.icon}</Text>
          </Box>
          <Stack gap="xs" style={{ flex: 1 }}>
            <Text testID={`${cardTestID}-class`} variant="heading">
              {characterClass.label}
            </Text>
            <Text color="textMuted" testID={`${cardTestID}-membership`} variant="caption">
              {membership.displayName}
            </Text>
          </Stack>
        </Stack>
        {isSelected ? (
          <Text color="textMuted" testID={`${cardTestID}-selected`} variant="caption">
            Selected
          </Text>
        ) : null}
      </Stack>

      <Stack gap="xs" marginTop="lg">
        <Text style={lightStyle} testID={`${cardTestID}-light`}>
          {character.light}
        </Text>
        <Text color="textMuted" testID={`${cardTestID}-last-played`} variant="caption">
          {formatLastPlayed(character.dateLastPlayed)}
        </Text>
      </Stack>
    </Pressable>
  );
}

export function CharacterSelectorPage() {
  const { ensureValidTokens } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [characters, setCharacters] = useState<CharacterOption[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<SelectedCharacter | null>(() =>
    readSelectedCharacter(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadCharacters() {
      setIsLoading(true);
      setError(null);

      try {
        const tokens = await ensureValidTokens();
        if (!tokens) {
          throw new Error("Sign in again to load your Destiny characters.");
        }

        const { apiKey } = getBungieApiConfig();
        const client = new BungieClient({
          apiKey,
          accessToken: tokens.accessToken,
        });
        const memberships = await client.getPlayableMemberships();
        if (memberships.length === 0) {
          throw new Error(
            "No playable Destiny memberships were found. If you only linked defunct platforms (e.g. Stadia), sign in on Steam, Xbox, or PlayStation.",
          );
        }

        const loadFailures: unknown[] = [];
        const characterGroups = await Promise.all(
          memberships.map(async (membership) => {
            try {
              const membershipCharacters = await client.getCharacters(
                membership.membershipType,
                membership.membershipId,
              );

              return membershipCharacters.map((character) => ({
                membership,
                character,
              }));
            } catch (loadError) {
              loadFailures.push(loadError);
              return [];
            }
          }),
        );

        const loadedCharacters = characterGroups.flat();
        if (loadedCharacters.length === 0 && loadFailures.length > 0) {
          throw loadFailures[0];
        }

        if (!cancelled) {
          setCharacters(loadedCharacters);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(formatApiError(loadError, "Unable to load characters."));
          setCharacters([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadCharacters();

    return () => {
      cancelled = true;
    };
  }, [ensureValidTokens, reloadToken]);

  const handleRetry = useCallback(() => {
    setReloadToken((current) => current + 1);
  }, []);

  const handleSelect = useCallback(
    (option: CharacterOption) => {
      const selection: SelectedCharacter = {
        membershipType: option.membership.membershipType,
        membershipId: option.membership.membershipId,
        characterId: option.character.characterId,
      };

      writeSelectedCharacter(selection);
      setSelectedCharacter(selection);
      navigate(createInventoryUrl(selection));
    },
    [navigate],
  );

  return (
    <Screen testID="character-selector">
      <Stack gap="xl" style={{ maxWidth: 960, width: "100%" }}>
        <Stack gap="xs">
          <Text variant="heading">Choose a character</Text>
          <Text color="textMuted">
            Pick the Guardian whose weapons you want to inspect in God Roll Vault.
          </Text>
        </Stack>

        {isLoading ? (
          <Stack align="center" gap="md" padding="xl" testID="character-selector-loading">
            <LoadingSpinner testID="character-selector-loading-spinner" />
            <Text color="textMuted">Loading characters...</Text>
          </Stack>
        ) : error ? (
          <ErrorState message={error} onRetry={handleRetry} testID="character-selector-error" />
        ) : characters.length === 0 ? (
          <EmptyState
            icon="?"
            message="No Destiny characters were found for this Bungie account."
            testID="character-selector-empty"
          />
        ) : (
          <Stack
            direction="horizontal"
            gap="lg"
            style={{
              alignItems: "stretch",
              flexWrap: "wrap",
            }}
            testID="character-selector-cards"
          >
            {characters.map((option) => (
              <CharacterCard
                isSelected={matchesSelection(option, selectedCharacter)}
                key={`${option.membership.membershipId}:${option.character.characterId}`}
                onSelect={() => handleSelect(option)}
                option={option}
              />
            ))}
          </Stack>
        )}

        <Box
          padding="md"
          style={{
            backgroundColor: theme.colors.surfaceMuted,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
          }}
        >
          <Text color="textMuted" variant="caption">
            Your last selected character is saved on this device.
          </Text>
        </Box>
      </Stack>
    </Screen>
  );
}
