import { Text, View } from "react-native";

import { perkListPresentationByStatus } from "./PerkList.constants.js";
import { perkListStyles } from "./PerkList.styles.js";
import type { PerkListItem, PerkListProps } from "./PerkList.types.js";
import { createPerkListItems, getPerkListValue } from "./PerkList.utils.js";

function getTargetLabel(item: PerkListItem): string | undefined {
  if (item.status !== "missing" || !item.target || !item.perk) {
    return undefined;
  }

  return `Target: ${item.target}`;
}

function createAccessibilityLabel(item: PerkListItem, statusLabel: string): string {
  const value = getPerkListValue(item);
  const targetLabel = getTargetLabel(item);
  const targetDescription = targetLabel ? `, ${targetLabel.toLowerCase()}` : "";

  return `${item.label}: ${value}, ${statusLabel.toLowerCase()}${targetDescription}`;
}

export function PerkList({
  perks,
  matchResult,
  style,
  testID = "perk-list",
  ...viewProps
}: PerkListProps) {
  const items = createPerkListItems(perks, matchResult);

  return (
    <View {...viewProps} style={[perkListStyles.container, style]} testID={testID}>
      {items.map((item) => {
        const presentation = perkListPresentationByStatus[item.status];
        const value = getPerkListValue(item);
        const targetLabel = getTargetLabel(item);

        return (
          <View
            accessibilityLabel={createAccessibilityLabel(item, presentation.statusLabel)}
            key={item.key}
            style={[perkListStyles.row, presentation.containerStyle]}
            testID={`${testID}-${item.key}`}
          >
            <View style={perkListStyles.rowHeader}>
              <Text style={[perkListStyles.label, presentation.labelStyle]}>{item.label}</Text>
              <Text style={[perkListStyles.status, presentation.statusStyle]}>
                {presentation.statusLabel}
              </Text>
            </View>
            <Text style={[perkListStyles.value, presentation.valueStyle]}>{value}</Text>
            {targetLabel ? <Text style={perkListStyles.target}>{targetLabel}</Text> : null}
          </View>
        );
      })}
    </View>
  );
}
