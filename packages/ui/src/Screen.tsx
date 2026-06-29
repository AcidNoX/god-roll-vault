import type { ReactNode } from "react";
import { View } from "react-native";

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
