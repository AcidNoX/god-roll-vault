import type { WeaponDuplicateGroup } from "@god-roll-vault/core";
import { Text, View } from "react-native";
import { useTheme } from "../../../theme/index.js";
import { Stack } from "../../atoms/Stack/index.js";
import { WeaponCard } from "../WeaponCard/WeaponCard.js";
import { weaponGroupCardStyles } from "./WeaponGroupCard.styles.js";
import type { WeaponGroupCardProps } from "./WeaponGroupCard.types.js";

function buildDispositionSummary(group: WeaponDuplicateGroup): string {
  if (group.copyCount === 1) {
    return "";
  }

  const keepCount = group.instances.filter((instance) => instance.disposition === "keep").length;
  const dismantleCount = group.instances.filter(
    (instance) => instance.disposition === "dismantle",
  ).length;
  const considerCount = group.instances.filter(
    (instance) => instance.disposition === "consider",
  ).length;

  const parts = [`${group.copyCount} copies`];
  if (keepCount > 0) {
    parts.push(`keep ${keepCount}`);
  }
  if (dismantleCount > 0) {
    parts.push(`dismantle ${dismantleCount}`);
  }
  if (considerCount > 0) {
    parts.push(`consider ${considerCount}`);
  }

  return parts.join(" · ");
}

export function WeaponGroupCard({ group, onSelectInstance }: WeaponGroupCardProps) {
  const theme = useTheme();
  const groupTestID = `weapon-group-${group.itemHash}`;
  const summary = buildDispositionSummary(group);

  return (
    <Stack
      gap="sm"
      style={[
        weaponGroupCardStyles.container,
        group.copyCount > 1 ? weaponGroupCardStyles.duplicateContainer : undefined,
      ]}
      testID={groupTestID}
    >
      {group.copyCount > 1 ? (
        <View style={weaponGroupCardStyles.header} testID={`${groupTestID}-header`}>
          <Text style={[weaponGroupCardStyles.title, { color: theme.colors.text }]}>
            {group.weaponName}
          </Text>
          <Text
            style={[weaponGroupCardStyles.summary, { color: theme.colors.textMuted }]}
            testID={`${groupTestID}-summary`}
          >
            {summary}
          </Text>
        </View>
      ) : null}

      <Stack gap="sm">
        {group.instances.map((instance) => (
          <WeaponCard
            disposition={instance.disposition}
            key={instance.evaluation.weapon.itemInstanceId}
            matchResult={instance.evaluation.result}
            onPress={
              onSelectInstance
                ? () => onSelectInstance(instance.evaluation.weapon.itemInstanceId)
                : undefined
            }
            weapon={instance.evaluation.weapon}
          />
        ))}
      </Stack>
    </Stack>
  );
}
