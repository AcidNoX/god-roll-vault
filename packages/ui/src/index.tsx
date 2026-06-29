import type { ReactNode } from "react";

import { Box } from "./Box.js";
import { Text } from "./Text.js";

export type { BoxProps } from "./Box.js";
export { Box } from "./Box.js";
export type { PressableProps } from "./Pressable.js";
export { Pressable } from "./Pressable.js";
export type { StackDirection, StackProps } from "./Stack.js";
export { Stack } from "./Stack.js";
export type { TextProps } from "./Text.js";
export { Text } from "./Text.js";
export type { ColorToken, SpacingToken, SpacingValue, TextVariant } from "./theme.js";
export { theme } from "./theme.js";
export type { WeaponCardProps } from "./WeaponCard.js";
export { WeaponCard } from "./WeaponCard.js";

export type AppTextProps = {
  children: ReactNode;
  testID?: string;
};

export function AppText({ children, testID }: AppTextProps) {
  return <Text testID={testID}>{children}</Text>;
}

export type ScreenProps = {
  children: ReactNode;
  testID?: string;
};

export function Screen({ children, testID }: ScreenProps) {
  return (
    <Box
      testID={testID}
      backgroundColor="background"
      padding="lg"
      style={{
        flex: 1,
        minHeight: "100%",
      }}
    >
      {children}
    </Box>
  );
}
