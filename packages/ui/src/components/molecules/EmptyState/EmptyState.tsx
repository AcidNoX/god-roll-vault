import type { ReactNode } from "react";

import { Box, Stack, Text } from "../../atoms/index.js";
import { emptyStateStyles } from "./EmptyState.styles.js";
import type { EmptyStateProps } from "./EmptyState.types.js";

function renderIcon(icon: ReactNode) {
  if (typeof icon === "string" || typeof icon === "number") {
    return (
      <Text style={emptyStateStyles.iconText} variant="heading">
        {icon}
      </Text>
    );
  }

  return icon;
}

export function EmptyState({ icon, message, style, testID }: EmptyStateProps) {
  return (
    <Stack
      align="center"
      gap="sm"
      padding="xl"
      style={[emptyStateStyles.container, style]}
      testID={testID}
    >
      <Box style={emptyStateStyles.icon} testID={testID && `${testID}-icon`}>
        {renderIcon(icon)}
      </Box>
      <Text
        color="textMuted"
        style={emptyStateStyles.message}
        testID={testID && `${testID}-message`}
      >
        {message}
      </Text>
    </Stack>
  );
}
