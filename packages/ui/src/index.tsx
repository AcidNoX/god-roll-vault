import type { ReactNode } from "react";
import { Text as RNText, View } from "react-native";

export type { WeaponCardProps } from "./WeaponCard.js";
export { WeaponCard } from "./WeaponCard.js";

export type AppTextProps = {
  children: ReactNode;
  testID?: string;
};

export function AppText({ children, testID }: AppTextProps) {
  return (
    <RNText testID={testID} style={{ color: "#f5f5f5", fontSize: 16 }}>
      {children}
    </RNText>
  );
}

export type ScreenProps = {
  children: ReactNode;
  testID?: string;
};

export function Screen({ children, testID }: ScreenProps) {
  return (
    <View
      testID={testID}
      style={{
        flex: 1,
        backgroundColor: "#0b0b14",
        padding: 16,
        minHeight: "100%",
      }}
    >
      {children}
    </View>
  );
}
