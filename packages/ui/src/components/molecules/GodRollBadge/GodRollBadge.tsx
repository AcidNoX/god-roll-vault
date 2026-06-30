import { Text, View } from "react-native";

import {
  gameModeLabels,
  godRollBadgePresentationByStatus,
} from "./GodRollBadge.constants.js";
import { godRollBadgeStyles } from "./GodRollBadge.styles.js";
import type { GodRollBadgeProps } from "./GodRollBadge.types.js";

function formatScore(score: number | undefined): string | undefined {
  if (score === undefined || !Number.isFinite(score)) {
    return undefined;
  }

  return `${Math.round(score)}%`;
}

function createAccessibilityLabel({
  modeLabel,
  scoreLabel,
  statusDescription,
}: {
  modeLabel: string;
  scoreLabel?: string;
  statusDescription: string;
}): string {
  const scoreDescription = scoreLabel ? `, score ${scoreLabel.replace("%", " percent")}` : "";

  return `${modeLabel} ${statusDescription}${scoreDescription}`;
}

export function GodRollBadge({ mode, score, status, style, testID, ...viewProps }: GodRollBadgeProps) {
  const modeLabel = gameModeLabels[mode];
  const presentation = godRollBadgePresentationByStatus[status];
  const scoreLabel = formatScore(score);

  return (
    <View
      {...viewProps}
      accessibilityLabel={createAccessibilityLabel({
        modeLabel,
        scoreLabel,
        statusDescription: presentation.accessibilityDescription,
      })}
      style={[godRollBadgeStyles.badge, presentation.containerStyle, style]}
      testID={testID ?? `god-roll-badge-${mode}-${status}`}
    >
      <Text style={[godRollBadgeStyles.modeLabel, presentation.textStyle]}>{modeLabel}</Text>
      <Text style={[godRollBadgeStyles.statusLabel, presentation.textStyle]}>
        {presentation.label}
      </Text>
      {scoreLabel ? (
        <Text style={[godRollBadgeStyles.scoreLabel, presentation.textStyle]}>{scoreLabel}</Text>
      ) : null}
    </View>
  );
}
