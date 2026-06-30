import { ActivityIndicator, View } from "react-native";

import { theme } from "../../../theme/index.js";
import { loadingSpinnerStyles } from "./LoadingSpinner.styles.js";
import type { LoadingSpinnerProps } from "./LoadingSpinner.types.js";

export function LoadingSpinner({
  accessibilityLabel = "Loading",
  color = theme.colors.primary,
  size = "large",
  style,
  testID,
}: LoadingSpinnerProps) {
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
      style={[loadingSpinnerStyles.container, style]}
      testID={testID}
    >
      <ActivityIndicator color={color} size={size} />
    </View>
  );
}
