import type { ReactNode } from "react";
import { Text as RNText, View } from "react-native";

import { useTheme } from "./theme.js";

export type { DesignTokens, Theme, ThemeProviderProps } from "./theme.js";
export {
  borderRadius,
  colors,
  darkTheme,
  designTokens,
  spacing,
  ThemeProvider,
  typography,
  useTheme,
} from "./theme.js";
export type { WeaponCardProps } from "./WeaponCard.js";
export { WeaponCard } from "./WeaponCard.js";

export type AppTextProps = {
  children: ReactNode;
  testID?: string;
};

export function AppText({ children, testID }: AppTextProps) {
  const theme = useTheme();

  return (
    <RNText
      testID={testID}
      style={{
        color: theme.colors.text,
        fontSize: theme.typography.fontSize.body,
        lineHeight: theme.typography.lineHeight.body,
      }}
    >
      {children}
    </RNText>
  );
}

export type ScreenProps = {
  children: ReactNode;
  testID?: string;
};

export function Screen({ children, testID }: ScreenProps) {
  const theme = useTheme();

  return (
    <View
      testID={testID}
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.lg,
        minHeight: "100%",
      }}
    >
      {children}
    </View>
  );
}
