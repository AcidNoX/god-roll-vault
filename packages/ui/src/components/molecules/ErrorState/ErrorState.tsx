import { Pressable, Stack, Text } from "../../atoms/index.js";
import { errorStateStyles } from "./ErrorState.styles.js";
import type { ErrorStateProps } from "./ErrorState.types.js";

export function ErrorState({
  message,
  onRetry,
  retryLabel = "Try again",
  style,
  testID,
}: ErrorStateProps) {
  return (
    <Stack
      align="center"
      gap="md"
      padding="xl"
      style={[errorStateStyles.container, style]}
      testID={testID}
    >
      <Text color="textMuted" style={errorStateStyles.message} testID={testID && `${testID}-message`}>
        {message}
      </Text>
      <Pressable onPress={onRetry} testID={testID && `${testID}-retry-button`}>
        <Text color="primaryText" style={errorStateStyles.retryLabel} variant="caption">
          {retryLabel}
        </Text>
      </Pressable>
    </Stack>
  );
}
